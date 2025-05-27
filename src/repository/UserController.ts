import { Request, Response, NextFunction, } from 'express';
import { ILike } from 'typeorm';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import asyncWrapper from '../middleware/async';
import { otpGenerator } from '../utils/otp';
import { sendEmail } from '../utils/sendEmail';
import { BadRequestError, UnauthorizedError } from '../error';
import { AppDataSource } from '../config/database';
import { User } from '../entity/userEntity';
import { Token } from '../entity/Token';
import { Subject } from 'typeorm/persistence/Subject.js';

dotenv.config();

export const test = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to Blog' });
};

export const SignUp = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new BadRequestError(errors.array()[0].msg));

    if (req.body.password !== req.body.confirmPassword) return next(new BadRequestError('Passwords do not match'));

    const userRepo = AppDataSource.getRepository(User);
    //checking if email already exist
    const existingUser = await userRepo.findOneBy({ email: req.body.email });
    if (existingUser) return next(new BadRequestError('Email is already in use'));
     //hashing Password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //otp generator
    const otp = otpGenerator();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
     // create new user
    const newUser = userRepo.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        otp,
        otpExpires,
        verified: false
    });
    // saving user in database
    const savedUser = await userRepo.save(newUser);
  
   
    // if email sending fails, delete the user
    if (!savedUser) return next(new BadRequestError('Failed to create user account'));
// generate token
 const token = jwt.sign({ id: savedUser.id, role: savedUser.role, email: savedUser.email, otp }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
    const verificationLink = `http://localhost:4000/Validateopt/${token}`;  
 //sending email to user contain otp
await sendEmail({
  recipient: savedUser.email,
  subject: 'Verify your account',
  body: `Your Verification Email is:  ${verificationLink}`
});
    res.status(201).json({ message: 'User account created!', user: savedUser, token });
});

export const Validateopt = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const Verificationtoken = req.params.token;

  let decoded;
  try {
    decoded = jwt.verify(Verificationtoken, process.env.JWT_SECRET_KEY!) as {
      id: string;
      email: string;
      role: string;
      otp: string;
      iat: number;
      exp: number;
    };
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: decoded.id });

  if (!user) return next(new UnauthorizedError('User not found'));
  if (user.otpExpires.getTime() < Date.now()) return next(new UnauthorizedError('OTP expired'));

  user.verified = true;
  await userRepo.save(user);

  const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '1h',
  });

  res.status(200).json({ message: 'User account verified!', user, token });
});


export const SignIn = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new BadRequestError(errors.array()[0].msg));

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email: req.body.email });
    if (!user) return next(new BadRequestError('Invalid credentials'));

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) return next(new BadRequestError('Invalid password'));

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', user, token });
});

export const getAllusers = asyncWrapper(async (_req: Request, res: Response) => {
    const users = await AppDataSource.getRepository(User).find();
    res.status(200).json({ size: users.length, users });
});

export const getUserById=asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });
    if (!user) return next(new BadRequestError('User not found'));
    res.status(200).json({ user }); 
});
export const Logout = asyncWrapper(async (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Logout successful' }); // Token clearing depends on frontend/local storage
});

export const ForgotPassword = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new BadRequestError(errors.array()[0].msg));

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email: req.body.email });
    if (!user) return next(new BadRequestError('Invalid email'));

    const tokenRepo = AppDataSource.getRepository(Token);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY!, { expiresIn: '15m' });

    await tokenRepo.save(tokenRepo.create({ token, user, expirationDate: new Date(Date.now() + 5 * 60 * 1000) }));
    const resetLink = `https://localhost:8080/reset-password?token=${token}&id=${user.id}`;

    await sendEmail({recipient:user.email, 
        subject:'Reset your password', 
        body:`Click the link: ${resetLink}`});
    res.status(200).json({ message: 'Reset password link sent to your email' });
});

export const ResetPassword = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new BadRequestError(errors.array()[0].msg));
    if (req.body.password !== req.body.confirmPassword) return next(new BadRequestError('Passwords do not match'));

    const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET_KEY!) as { id: string };
    const tokenRepo = AppDataSource.getRepository(Token);
    const storedToken = await tokenRepo.findOneBy({ token: req.body.token });

    if (!decoded || !storedToken || decoded.id !== req.body.id || storedToken.user.id !== req.body.id)
        return next(new BadRequestError('Invalid or expired token'));

    if (storedToken.expirationDate.getTime() < Date.now()) return next(new BadRequestError('Token expired'));

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: req.body.id });
    if (!user) return next(new BadRequestError('User not found'));

    user.password = await bcrypt.hash(req.body.password, 10);
    await tokenRepo.delete({ token: req.body.token });
    await userRepo.save(user);

    res.status(200).json({ message: 'Password has been reset' });
});

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const updatedData = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const updatedUser = userRepo.merge(user, updatedData);
    await userRepo.save(updatedUser);

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
};

export const deleteUser = async (req: Request, res: Response,next:NextFunction) => {
    try{
    const id = req.params.id;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id });

    if (!user) return res.status(404).json({ message: 'User not found' });
    await userRepo.remove(user);

    res.status(200).json({ message: 'User deleted successfully' });}
    catch(err)
    {
        return next(err)
    }
};

export const findUserByName = async (req: Request, res: Response) => {
    const name = req.query.name as string;
const users = await AppDataSource.getRepository(User).find({
  where: {
    name: ILike(`%${name}%`)
  }
});


    if (!users.length)
        { 
            res.status(404).json({ message: 'No user found with that name' });
              return 
}
    res.status(200).json({ size: users.length, users });
};

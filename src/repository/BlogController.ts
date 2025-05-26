// import { Request, Response, NextFunction, } from 'express';
// import { ILike } from 'typeorm';
// import { validationResult } from 'express-validator';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import asyncWrapper from '../middleware/async';
// import { otpGenerator } from '../utils/otp';
// import { sendEmail } from '../utils/sendEmail';
// import { BadRequestError, UnauthorizedError } from '../error';
// import { AppDataSource } from '../config/database';
// import { User } from '../entity/userEntity';
// import { Token } from '../entity/Token';
// import { Subject } from 'typeorm/persistence/Subject.js';

// dotenv.config();

// export const test = (req: Request, res: Response) => {
//     res.status(200).json({ message: 'Welcome to Blog' });
// };


// export const CreateBlog = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return next(new BadRequestError(errors.array()[0].msg));

//     // if (req.body.password !== req.body.confirmPassword) return next(new BadRequestError('Passwords do not match'));

//     const userRepo = AppDataSource.getRepository(User);
//     //checking if email already exist
//     const existingBlog = await userRepo.findOneBy({ email: req.body.email });
//     if (existingBlog) return next(new BadRequestError('Email is already in use'));
//      //hashing Password
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     //otp generator
//     const otp = otpGenerator();
//     const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
//      // create new user
//     const newUser = userRepo.create({
//         name: req.body.name,
//         email: req.body.email,
//         password: hashedPassword,
//         role: req.body.role,
//         otp,
//         otpExpires,
//         verified: false
//     });
//     // saving user in database
//     const savedUser = await userRepo.save(newUser);
//     //sending email to user contain otp
// await sendEmail({
//   recipient: savedUser.email,
//   subject: 'Verify your account',
//   body: `Your OTP is ${otp}`
// });
   
// // generate token
//  const token = jwt.sign({ id: savedUser.id, role: savedUser.role, email: savedUser.email }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });

//     res.status(201).json({ message: 'User account created!', user: savedUser, token });
// });
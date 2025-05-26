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
import { Blog } from '../entity/blog';
import { Token } from '../entity/Token';
import { Subject } from 'typeorm/persistence/Subject.js';

dotenv.config();

export const test = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to Blog' });
};


export const CreateBlog = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new BadRequestError(errors.array()[0].msg));

    // if (req.body.password !== req.body.confirmPassword) return next(new BadRequestError('Passwords do not match'));

    const blogRepo = AppDataSource.getRepository(Blog);
    //checking if email already exist
    const existingBlog = await blogRepo.findOneBy({ name: req.body.name });
    if (existingBlog) return next(new BadRequestError('Name is already in use'));
   
    //otp generator
    const otp = otpGenerator();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
     // create new user
    const newblog = blogRepo.create({
        name: req.body.name,
        description: req.body.description,
        comments: req.body.comments,
        status: req.body.status,
        otp,
        otpExpires,
        verified: false
    });
    // saving user in database
    const savedBlog = await blogRepo.save(newblog);
    //sending email to user contain otp
// await sendEmail({
//   recipient: savedBlog.name,
//   subject: 'Verify your Blog',
//   body: `Your OTP is ${otp}`
// });
   
// generate token
 const token = jwt.sign({ id: savedBlog.id, name: savedBlog.name, description: savedBlog.description, status: savedBlog.status }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });

    res.status(201).json({ message: 'Blog created successfully!', blog: savedBlog, token });
});
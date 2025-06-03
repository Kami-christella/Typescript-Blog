import express from 'express';
import { NextFunction,Request,Response } from 'express';
import UserRouter from './userRoutes';
//import userRoutes from './RegisterUserRoutes';
const router = express.Router();

router.get('/', (request:Request, response:Response) => {
  response.send('<h2>Welcome to the Home Page</h2>');
});

router.get('/status', (request:Request, response:Response) => {
  response.json({ status: 'OK', uptime: process.uptime() });
});

router.use('/user', UserRouter);
//router.use('/all', userRoutes); // Assuming you want to use the same UserRouter for '/all' as well

export default router;
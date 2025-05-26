import express from 'express';
import { NextFunction,Request,Response } from 'express';
const router = express.Router();

router.get('/', (request:Request, response:Response) => {
  response.send('<h2>Welcome to the Home Page</h2>');
});

router.get('/status', (request:Request, response:Response) => {
  response.json({ status: 'OK', uptime: process.uptime() });
});

export default router;
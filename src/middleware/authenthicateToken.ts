// middleware/auth.ts

import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../error/index";

dotenv.config();

//  Extend Express Request to include 'user'
interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

//  1. Authenticate Token Middleware
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  });
};

//  2. Authorize Middleware
export const authorize = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || typeof req.user === "string" || (req.user as JwtPayload).role !== role) {
      return next(new ForbiddenError("You do not have permission to perform this action"));
    }
    next();
  };
};

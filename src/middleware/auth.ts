// middleware/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../error/index";

dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// 1. Authentication middleware - verifies token and sets req.user
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No token provided"));
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};

// 2. Authorization middleware - checks if user has required role (expects req.user to exist)
export const authorize = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }
    
    if ((req.user as JwtPayload).role !== role) {
      return next(new ForbiddenError("You do not have permission to perform this action"));
    }
    
    next();
  };
};

export { AuthenticatedRequest };
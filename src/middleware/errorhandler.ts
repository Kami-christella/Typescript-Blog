import { Request, Response, NextFunction } from "express";

// Define a custom error type to capture 'status' and 'message' properties
interface CustomError extends Error {
  status?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Internal server error";

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    // Include stack trace only in development environment
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};

export default errorHandler;

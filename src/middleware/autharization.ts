// middlewares/authorize.ts
import { Request, Response, NextFunction } from "express";
import { ForbiddenError,NotFoundError } from "../utils/errors";
import { AuthenticatedRequest } from "../types/common.types";
export function authorizeRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    console.log("Role check:", user?.role);

    if (!user) {
      throw new NotFoundError("User")
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError("No access allowed for you");
    }

    next();
  };
}
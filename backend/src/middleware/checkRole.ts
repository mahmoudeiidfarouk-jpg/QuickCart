import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

interface AuthUser {
    userId: string;
    role: "customer" | "seller" | "admin";
}

interface AuthRequest extends Request {
    user: AuthUser;
}

type Role = "customer" | "seller" | "admin";

const checkRole = (...roles: Role[]) => 
    (
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = req.user;

            if(!user || !roles.includes(user.role)) {
               return next( new AppError("Access denied", 403) );
            };

            next();
        } catch (error) {
            next(error);
        }
    }

    export default checkRole;
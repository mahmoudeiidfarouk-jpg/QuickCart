import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import AppError from "../utils/appError";

interface AuthUser {
    userId: string;
    role: "customer" | "seller" | "admin";
}

interface AuthRequest extends Request{
    user: AuthUser;
}

const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const  headers = req.headers.authorization;

        if(!headers || !headers.startsWith("Bearer ")) {
            return next(new AppError("Access denied. No token provided", 401));
        };

        const token = headers.split(' ')[1]

        const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;

        req.user = decoded;

        next();
    } catch (error) {

    return next(
        new AppError("Invalid or expired token", 401)
    );

    }
}

export default verifyToken;
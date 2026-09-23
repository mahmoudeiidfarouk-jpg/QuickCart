import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import User from "../models/user";

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return next( new AppError("Email already exists", 409));
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create(
            {
                name,
                email,
                password: hashedPassword,
            }
        );

        return res.status(201)
        .json({ 
            message: "User registered successfully", 
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        })

    } catch (error) {
        next(error);
    }
};

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user) {
            return next( new AppError("Invalid email or password", 401));
        };

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return next( new AppError("Invalid email or password", 401) );
        }

        const token = generateToken(
            user._id.toString(),
            user.role,
        );

        return res.status(200)
        .json(
            {
                message: "Login successful",
                token,
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            }
        )
        
    } catch (error) {
        next(error);
    }

};
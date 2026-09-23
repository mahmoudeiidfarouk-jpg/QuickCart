import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import { ZodError } from "zod";

const errorHandelr = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {

    if(err instanceof AppError) {

        return res.status(err.statusCode)
        .json({
            message: err.message
        });
    };

    if(err instanceof ZodError) {

        return res.status(400)
        .json({
            message: "Validation error",
            error: err.issues,
        });       
    };

    return res.status(500)
    .json({ 
       message: "Internal server error"
    });

}

export default errorHandelr;
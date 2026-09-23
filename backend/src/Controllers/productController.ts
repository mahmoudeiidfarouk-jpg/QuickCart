import { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import AppError from "../utils/appError";

interface AuthUser {
    userId: string;
    role: "customer" | "seller" | "admin";
}

export interface AuthRequest extends Request{
    user: AuthUser;
}

export const createProduct = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name, description, price, category, stock, image } = req.body;

        const seller = req.user.userId;

        const newProduct = await Product.create(
            {
                name,
                description,
                price,
                category,
                stock,
                image,
                seller,
            }
        );

        res.status(201)
        .json({
            message: "Product created successfully",
            data: newProduct,
        });

    } catch (error) {
        next(error);
    }
};

export const getProducts = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const products = await Product.find();

        res.status(200)
        .json({
            message: "Products fetched successfully",
            data: products,
        });

    } catch (error) {
        next(error);
    }
};

export const getProductById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const product = await Product.findById( id );

        if(!product) {
            return next( new AppError("Product not found", 404) );
        };

        res.status(200)
        .json({
            message: "Product fetched successfully",
            data: product,
        });

    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const { name, description, price, category, stock, image } = req.body;

        const updates = {
            name,
            description,
            price,
            category,
            stock,
            image,
        };

        const product = await Product.findById(id);
        
        if(!product) {
            return next( new AppError("Product not found", 404) );
        };

        if(product.seller.toString() !== req.user.userId) {
            return next(new AppError("Access denied", 403));
        }

        const productUp = await Product.findByIdAndUpdate(id, updates, {new: true});

        res.status(200)
        .json({
            message: "Product updated successfully",
            data: productUp,
        });


    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        
        if(!product) {
            return next( new AppError("Product not found", 404) );
        };

        if(product.seller.toString() !== req.user.userId) {
            return next(new AppError("Access denied", 403));
        }
        
        const productDelete = await Product.findByIdAndDelete( id );

        res.status(200)
        .json({
            message: "Product deleted successfully",
            data: productDelete,
        });
        

    } catch (error) {
        next(error);
    }
}
import { Request, Response, NextFunction } from "express";
import Cart from "../models/cart";
import Product from "../models/product";
import AppError from "../utils/appError";

interface AuthUser {
    userId: string;
    role: "customer" | "seller" | "admin";
}

interface AuthRequest extends Request {
    user: AuthUser;
}

export const addToCart = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, quantity } = req.body;

        const userId = req.user.userId;

        const product = await Product.findById(productId);

        if(!product) {
            return next( new AppError("Product not found", 404) );
        };

        const cart = await Cart.findOne({ user: userId });

        if(cart === null) {
            const newCart = await Cart.create(
                {
                    user: userId,
                    items: [
                    {
                        product: productId,
                        quantity,
                    }
                ]
                }
            );

            return res.status(201).json({
                message: "Product added to cart successfully",
                data: newCart,
            });

        };

        let existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if(existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.items.push({
            product: productId,
            quantity,
            });
        }

        await cart.save();

        return res.status(200).json({
            message: "Product added to cart successfully",
            data: cart,
        });

    } catch (error) {
        next(error);
    }
} 

export const getCart = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId })
        .populate("items.product");

        if(!cart) {
            return next( new AppError( "Cart not found", 404 ) );
        };

        return res.status(200).json({
            message: "Cart fetched successfully",
            data: cart,
        });

    } catch (error) {
       next(error); 
    }
}

export const updateCartItem = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId, quantity } = req.body;

        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return next(new AppError("Cart not found", 404));
        };

        const updateItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if(updateItem) {
            updateItem.quantity = quantity;
        }
        else {
            return next(new AppError("Product not found in cart", 404) );
        }

        await cart.save();

        return res.status(200).json({
            message: "Cart item updated successfully",
            data: cart,
        });

    } catch (error) {
        next(error);
    }
}

export const removeFromCart = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = req.body;

        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return next(new AppError("Cart not found", 404));
        };

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if(existingItem) {
            cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );
        }
        else {
            return next(new AppError("Product not found in cart", 404) );
        }
  
        await cart.save();

        return res.status(200).json({
            message: "Cart item deleted successfully",
            data: cart,
        });        

    } catch (error) {
        next(error)
    }
}

export const clearCart = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return next(new AppError("Cart not found", 404));
        }

        cart.items = [];

        await cart.save();

        return res.status(200).json({
            message: "Cart cleared successfully",
            data: cart,
        });

    } catch (error) {
        next(error);
    }
};
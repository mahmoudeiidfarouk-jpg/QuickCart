import { Request, Response, NextFunction } from "express";
import Cart from "../models/cart";
import Order from "../models/order";
import Product from "../models/product";
import AppError from "../utils/appError";

interface AuthUser {
    userId: string;
    role: "customer" | "seller" | "admin";
}

interface AuthRequest extends Request {
    user: AuthUser;
}


// ========================================
// CREATE ORDER
// ========================================

export const createOrder = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user.userId;

        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return next(new AppError("Cart is empty", 400));
        }

        const products = await Promise.all(
            cart.items.map((item) => Product.findById(item.product))
        );

        const checkProduct = products.some(
            (product) => product === null
        );

        if (checkProduct) {
            return next(new AppError("Product not found", 404));
        }

        const checkStock = cart.items.some((item) => {
            const product = products.find(
                (product) =>
                    product?._id.toString() === item.product.toString()
            );

            return (
                product !== null &&
                product !== undefined &&
                item.quantity > product.stock
            );
        });

        if (checkStock) {
            return next(
                new AppError("Insufficient stock", 400)
            );
        }

        const orderItems = cart.items.map((item) => {
            const product = products.find(
                (product) =>
                    product?._id.toString() === item.product.toString()
            );

            if (!product) {
                throw new AppError("Product not found", 404);
            }

            return {
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            };
        });

        const totalPrice = orderItems.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );

        const newOrder = await Order.create({
            user: userId,
            items: orderItems,
            totalPrice,
        });

        await Promise.all(
            cart.items.map(async (item) => {
                await Product.findByIdAndUpdate(
                    item.product,
                    {
                        $inc: {
                            stock: -item.quantity,
                        },
                    }
                );
            })
        );

        cart.items = [];

        await cart.save();

        return res.status(201).json({
            message: "Order created successfully",
            data: newOrder,
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// GET MY ORDERS
// ========================================

export const getMyOrders = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user.userId;

        const orders = await Order.find({
            user: userId,
        }).populate("items.product");

        return res.status(200).json({
            message: "Orders fetched successfully",
            data: orders,
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// GET ORDER BY ID
// ========================================

export const getOrderById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const order = await Order.findOne({
            _id: id,
            user: userId,
        }).populate("items.product");

        if (!order) {
            return next(
                new AppError("Order not found", 404)
            );
        }

        return res.status(200).json({
            message: "Order fetched successfully",
            data: order,
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// CANCEL ORDER
// ========================================

export const cancelOrder = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const order = await Order.findOne({
            _id: id,
            user: userId,
        });

        if (!order) {
            return next(
                new AppError("Order not found", 404)
            );
        }

        if (
            order.status !== "pending" &&
            order.status !== "processing"
        ) {
            return next(
                new AppError(
                    "Order cannot be cancelled",
                    400
                )
            );
        }

        order.status = "cancelled";

        await order.save();

        return res.status(200).json({
            message: "Order cancelled successfully",
            data: order,
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// UPDATE ORDER STATUS
// ========================================

export const updateOrderStatus = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return next(
                new AppError("Order not found", 404)
            );
        }

        const allowedStatuses = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ];

        if (!allowedStatuses.includes(status)) {
            return next(
                new AppError("Invalid order status", 400)
            );
        }

        order.status = status;

        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully",
            data: order,
        });

    } catch (error) {
        next(error);
    }
};
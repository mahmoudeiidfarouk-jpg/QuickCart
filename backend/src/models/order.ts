import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        price: {
            type: Number,
            required: true,
            min: 0,            
        },
    },

    {_id: false}
);

const orderSchema = new Schema<IOrder>(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items: IOrderItem[]) => items.length > 0,
                message: "Order must contain at least one item",
            }
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },
    },
    { timestamps: true },        
);


const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
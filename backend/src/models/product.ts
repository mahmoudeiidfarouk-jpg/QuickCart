import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
    seller: mongoose.Types.ObjectId;
};

const productSchema = new Schema <IProduct> (
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
            minlength: 5,
            maxlength: 1000,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "Stock must be an integer",
            },
        },
        image: {
            type: String,
            required: true,
            trim: true,
        },
        seller: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },

    {timestamps: true},
);

const Product = mongoose.model <IProduct>("Product", productSchema);

export default Product;
import mongoose, { Schema, Document } from "mongoose";

interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
};

interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
}

const cartItemSchema = new Schema <ICartItem> (
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
    },

    {id: false},
)

const cartSchema = new Schema <ICart> (
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        items: {
            type: [cartItemSchema],
            default: [],
        },
    },

    {timestamps: true}
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
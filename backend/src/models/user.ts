import mongoose, {Schema, Document} from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "customer" | "seller" | "admin";
};

const userSchema = new Schema<IUser> (
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        role: {
            type: String,
            enum: ["customer", "seller", "admin"],
            default: "customer",
        }   
    },

    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
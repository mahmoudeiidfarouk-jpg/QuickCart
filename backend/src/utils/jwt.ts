import Jwt from "jsonwebtoken";

export const generateToken = (
    userId: string,
    role: "customer" | "seller" | "admin"
) => {

    const token = Jwt.sign(
        {
            userId,
            role,

        },

        process.env.JWT_SECRET as string,

        {
            expiresIn: "7d"
        },
    );

    return token;
};  
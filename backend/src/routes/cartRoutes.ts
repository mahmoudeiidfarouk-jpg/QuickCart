import { Router, RequestHandler } from "express";

import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "../Controllers/cartController";

import verifyToken from "../middleware/verifyToken";
import validate from "../middleware/validate";

import cartValidator from "../validators/cartValidator";

const router = Router();

router.use(verifyToken as RequestHandler);

router.get(
    "/",
    getCart as RequestHandler
);

router.post(
    "/",
    validate(cartValidator) as RequestHandler,
    addToCart as RequestHandler
);

router.patch(
    "/",
    validate(cartValidator) as RequestHandler,
    updateCartItem as RequestHandler
);

router.delete(
    "/",
    validate(cartValidator) as RequestHandler,
    removeFromCart as RequestHandler
);

router.delete(
    "/clear",
    clearCart as RequestHandler
);

export default router;
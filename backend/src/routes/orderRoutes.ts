import { Router, RequestHandler } from "express";

import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
} from "../Controllers/orderController";

import verifyToken from "../middleware/verifyToken";
import checkRole from "../middleware/checkRole";

const router = Router();

router.post(
    "/",
    verifyToken as RequestHandler,
    checkRole("customer") as RequestHandler,
    createOrder as RequestHandler
);

router.get(
    "/my-orders",
    verifyToken as RequestHandler,
    checkRole("customer") as RequestHandler,
    getMyOrders as RequestHandler
);

router.get(
    "/:id",
    verifyToken as RequestHandler,
    checkRole("customer") as RequestHandler,
    getOrderById as RequestHandler
);

router.patch(
    "/:id/cancel",
    verifyToken as RequestHandler,
    checkRole("customer") as RequestHandler,
    cancelOrder as RequestHandler
);

router.patch(
    "/:id/status",
    verifyToken as RequestHandler,
    checkRole("admin") as RequestHandler,
    updateOrderStatus as RequestHandler
);

export default router;
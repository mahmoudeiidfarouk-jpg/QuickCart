import { Router, RequestHandler } from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../Controllers/productController";

import verifyToken from "../middleware/verifyToken";
import checkRole from "../middleware/checkRole";
import validate from "../middleware/validate";

import {
    createProductValidator,
    updateProductValidator,
} from "../validators/productValidator";

const router = Router();

router.get("/", getProducts as RequestHandler);
router.get("/:id", getProductById as RequestHandler);

router.post(
    "/",
    verifyToken as RequestHandler,
    checkRole("seller") as RequestHandler,
    validate(createProductValidator) as RequestHandler,
    createProduct as RequestHandler
);

router.patch(
    "/:id",
    verifyToken as RequestHandler,
    checkRole("seller") as RequestHandler,
    validate(updateProductValidator) as RequestHandler,
    updateProduct as RequestHandler
);

router.delete(
    "/:id",
    verifyToken as RequestHandler,
    checkRole("seller") as RequestHandler,
    deleteProduct as RequestHandler
);

export default router;
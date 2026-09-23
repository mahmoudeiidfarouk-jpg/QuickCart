import { Router } from "express";

import { registerUser, loginUser } from "../Controllers/authController";

import validate from "../middleware/validate";
import registerValidator from "../validators/registerValidator";

const router = Router();

router.post(
    "/register",
    validate(registerValidator),
    registerUser
);

router.post(
    "/login",
    loginUser
);

export default router;
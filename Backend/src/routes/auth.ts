import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { body } from "express-validator";
import { validationMiddleware } from "../middleware/validate";

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
    body("name").isString().trim().isLength({ min: 1, max: 100 }),
  ],
  validationMiddleware,
  register
);

export default router;

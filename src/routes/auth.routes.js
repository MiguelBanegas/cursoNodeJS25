import { Router } from "express";
import {
  register,
  login,
  verifyCode,
  resetPassword,
} from "../controllers/auth.controllers.js";

const router = Router();
// define las rutas de autenticación
router.post("/register", register);
router.post("/verify-code", verifyCode);
router.post("/login", login);
router.post("/reset-password", resetPassword);

export default router;

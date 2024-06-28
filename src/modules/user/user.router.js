import { Router } from "express";
import * as userController from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { endpoints } from "./user.endPoint.js";
import { asyncHandler } from "../../utls/errorHandling.js";

const router = Router();
router.get(
  "/AllUser",
  auth(endpoints.getAll),
  asyncHandler(userController.getAllUser)
);
router.get(
  "/dataUser",
  auth(endpoints.getUser),
  asyncHandler(userController.getDateUser)
);
export default router;

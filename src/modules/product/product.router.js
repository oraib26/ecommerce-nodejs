import { Router } from "express";
import * as productController from "./product.controller.js";
import fileUpload, { fileValidation } from "../../utls/multer.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./product.endPoint.js";
import reviewRouter from "./../review/review.router.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import { createproduct } from "./product.validation.js";

const router = Router();
router.use("/:productId/review", reviewRouter);
router.get("/", productController.getproduct);
router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "subImages", maxCount: 4 },
  ]),
  validation(createproduct),
  asyncHandler(productController.createProduct)
);
export default router;

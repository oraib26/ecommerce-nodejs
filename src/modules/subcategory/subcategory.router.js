import { Router } from "express";
import * as subcategoryController from "./subcategory.controller.js";
import fileUpload, { fileValidation } from "../../utls/multer.js";
import { asyncHandler } from "../../utls/errorHandling.js";

import { auth } from "../../middleware/auth.js";
import { endPoint } from "./subcategory.endPoint.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./subcategory.validation.js";
const router = Router({ mergeParams: true });

router.post(
  "/",
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.createsubCategory),
  asyncHandler(subcategoryController.createSubCategory)
);
router.get(
  "/",
  auth(endPoint.getAll),
  asyncHandler(subcategoryController.getAllSubCategories)
);
router.get(
  "/getActive",
  asyncHandler(subcategoryController.getActivesubCategory)
);
router.get(
  "/getSpecific/:id",
  validation(validators.validationid),
  asyncHandler(subcategoryController.getDetailsubCategories)
);
router.patch(
  "/:id",
  auth(endPoint.update),
  fileUpload(fileValidation.image).single("image"),
  validation(validators.updateSub),
  asyncHandler(subcategoryController.updatesubCategories)
);
router.delete(
  "/:id",
  auth(endPoint.delete),
  validation(validators.validationid),
  asyncHandler(subcategoryController.deletesubCategories)
);
export default router;

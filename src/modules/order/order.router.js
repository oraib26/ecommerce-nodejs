import { Router } from "express";
import * as orderController from "./order.controller.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../utls/errorHandling.js";
import { endpoints } from "./order.endPoint.js";
import * as validators from "./order.validation.js";
import { validation } from "../../middleware/validation.js";

const router = Router();
router.post(
  "/",
  auth(endpoints.create),
  validation(validators.createOrder),
  asyncHandler(orderController.createOrder)
);
router.get(
  "/AllOrder",
  auth(endpoints.getAll),
  asyncHandler(orderController.getallOrder)
);
router.get(
  "/orderUser",
  auth(endpoints.orderUser),
  asyncHandler(orderController.getOrderUser)
);
router.patch(
  "/:orderId",
  auth(endpoints.updateOrder),
  validation(validators.updateStatus),
  asyncHandler(orderController.changeStatus)
);
export default router;

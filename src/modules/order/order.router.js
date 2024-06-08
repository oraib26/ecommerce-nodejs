import { Router } from "express";
import * as controller from './order.controller.js'
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./order.role.js";
const router = Router();



router.post('/',auth(endPoints.create),controller.create);
router.get('/all',auth(endPoints.all),controller.getOrders);
router.get('/userOrders',auth(endPoints.getOrder),controller.getUserOrders);
router.patch('/changeStatus',auth(endPoints.changeStatus),controller.changeStatus)




export default router;

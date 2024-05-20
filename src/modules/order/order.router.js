import { Router } from "express";
import * as controller from './order.controller.js'
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./order.role.js";
const router = Router();

router.post('/',auth(endPoints.create),controller.create);



export default router;

import { Router } from "express";
import * as controller from './user.controller.js'
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./user.role.js";
const router = Router();



router.get('/',auth(endPoints.getUsers),controller.getUsers);
router.get('/userData',auth(endPoints.userData),controller.getUserData);





export default router;

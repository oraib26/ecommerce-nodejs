import { Router } from "express";
import * as cotroller from './review.controller.js'
import fileUpload, { fileTypes } from "../../utls/multer.js";
import { endPoints } from "../review/review.role.js";
import { auth } from "../../middleware/auth.js";
const router = Router({mergeParams: true});

router.post('/',auth(endPoints.create),fileUpload(fileTypes.image).single('image'), cotroller.create)



export default router;

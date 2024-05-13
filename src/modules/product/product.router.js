import { Router } from "express";
import * as cotroller from './product.controller.js'
import fileUpload, { fileTypes } from "../../utls/multer.js";
import { endPoints } from "../category/category.role.js";
import { auth } from "../../middleware/auth.js";
const router = Router({caseSensitive: true});


router.post("/",auth(endPoints.create),fileUpload(fileTypes.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:5},
   
]),cotroller.create);

export default router;

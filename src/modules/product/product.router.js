import { Router } from "express";
import * as cotroller from './product.controller.js'
import fileUpload, { fileTypes } from "../../utls/multer.js";
import { endPoints } from "../product/product.role.js";
import { auth } from "../../middleware/auth.js";
import reviewRouter from '../review/review.router.js'
const router = Router({caseSensitive: true});


router.use('/:productId/review', reviewRouter)
router.post("/",auth(endPoints.create),fileUpload(fileTypes.image).fields([
    {name:'mainImage',maxCount:1},
    {name:'subImages',maxCount:5},
   
]),cotroller.create);

router.get('/',auth(endPoints.getAll),cotroller.getAll);

export default router;

import { Router } from "express";
import * as controller from './category.controller.js'
import fileUpload, { fileTypes } from "../../utls/multer.js";
const router = Router({caseSensitive: true});

router.post("/",fileUpload(fileTypes.image).single('image'),controller.createCategory);

export default router;

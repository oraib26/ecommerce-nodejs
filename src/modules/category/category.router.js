import { Router } from "express";
import * as controller from './category.controller.js'
import fileUpload, { fileTypes } from "../../utls/multer.js";
import { auth } from "../../middleware/auth.js";
import subcategoryRouter from "../subcategory/subcategory.router.js"
import { endPoints } from "./category.role.js";
const router = Router({caseSensitive: true});

router.use('/:id/subcategory',subcategoryRouter)
router.post('/',auth(endPoints.create),fileUpload(fileTypes.image).single('image'),controller.create);
router.get('/',auth(endPoints.get),controller.getAll);
router.get('/active',auth(endPoints.getActive),controller.getActive);
router.get('/:id',auth(endPoints.getActive),controller.getDetails);
router.patch('/:id',auth(endPoints.create),fileUpload(fileTypes.image).single('image'),controller.update);
router.delete('/:id',auth(endPoints.delete),controller.destroy);


export default router;

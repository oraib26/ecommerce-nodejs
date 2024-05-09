import { Router } from "express";
import * as controller from './category.controller.js'
import fileUpload, { fileTypes } from "../../utls/multer.js";
import { auth } from "../../middleware/auth.js";
import subcategoryRouter from "../subcategory/subcategory.router.js"
const router = Router({caseSensitive: true});

router.use('/:id/subcategory',subcategoryRouter)
router.post('/',auth(),fileUpload(fileTypes.image).single('image'),controller.create);
router.get('/',controller.getAll);
router.get('/active',controller.getActive);
router.get('/:id',controller.getDetails);
router.patch('/:id',auth(),fileUpload(fileTypes.image).single('image'),controller.update);
router.delete('/:id',auth(),controller.destroy);


export default router;

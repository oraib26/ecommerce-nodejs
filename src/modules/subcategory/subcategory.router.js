import { Router } from "express";
import * as controller from './subcategory.controller.js'
import fileUpload, { fileTypes } from "../../utls/multer.js";
import { auth } from "../../middleware/auth.js";
const router = Router({mergeParams: true});


router.post('/',auth(),fileUpload(fileTypes.image).single('image'),controller.create);
router.get('/',controller.getAll);
router.get('/active',controller.getActive);
router.get('/:id',controller.getDetails);
router.patch('/:id',auth(),fileUpload(fileTypes.image).single('image'),controller.update);
router.delete('/:id',auth(),controller.destroy);


export default router;

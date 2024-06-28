import {Router} from 'express';
import * as AuthController from './auth.controller.js';
import { asyncHandler } from '../../utls/errorHandling.js';
import fileUpload, { fileValidation } from '../../utls/multer.js';
import { auth } from '../../middleware/auth.js';
import { checkEmail } from '../../middleware/checkEmail.js';
import { validation } from '../../middleware/validation.js';
import * as validators from './auth.validation.js';
const router = Router();
router.get('/getUser',auth(['User']), AuthController.getUsers);
router.post('/signup',checkEmail
,validation(validators.RegisterSchema),asyncHandler(AuthController.signUp));
router.post('/excel',fileUpload(fileValidation.excel).single('excel'),asyncHandler(AuthController.addUserExcel))
router.get('/confirmEmail/:token',asyncHandler(AuthController.confirmEmail))
router.post('/signin',validation(validators.LogInSchema),asyncHandler(AuthController.signIn));
router.patch('/sendCode',validation(validators.sendCodevalidation),asyncHandler(AuthController.sendCode));
router.patch('/forgotPass',validation(validators.forgotPasswordvalid),asyncHandler(AuthController.forgotPassword));
router.delete('/invalidConfirm',asyncHandler(AuthController.deleteInvalidConfirm));
export default router;
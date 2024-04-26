import { Router } from "express";
import * as cotroller from './product.controller.js'
const router = Router({caseSensitive: true});


router.get("/", cotroller.getAll);

export default router;

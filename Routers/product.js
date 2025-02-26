import { Router } from "express";

import {getAllProduct,getProductByCode,addProduct,deleteProduct,updateProduct} from "../Controllers/product.js";


const router = Router();

router.get("/",getAllProduct);
router.get("/:id",getProductByCode);


router.post("/",addProduct);

router.delete("/:id",deleteProduct);

router.put("/:id",updateProduct);

export default router;
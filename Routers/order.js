import { Router } from "express";

import { getAllorders,addOrder,deleteOrder,getOrdersByUser,updateOrderDispatch} from "../Controllers/order.js";


const router = Router();

router.get("/",getAllorders);

router.get("/:customerId",getOrdersByUser);


router.post("/",addOrder);

router.delete("/:id",deleteOrder);

router.put("/:id",updateOrderDispatch);

export default router;
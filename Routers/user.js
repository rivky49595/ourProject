import { Router } from "express";

import {addUser,getUserByCode,getAllUsers,updateUserInfo,updatePassword,login} from "../Controllers/user.js";


const router = Router();

router.post("/", addUser);


router.get("/:id",getUserByCode);
router.get("/",getAllUsers);


router.put("/:id",updateUserInfo)
router.put("/:id/password",updatePassword)

router.post("/login",login);

export default router;
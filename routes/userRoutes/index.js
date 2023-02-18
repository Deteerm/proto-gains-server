import express from "express";
const router = express.Router();

import controllers from "../../controllers/userControllers/index.js";

const { signIn, signUp, signOut } = controllers;

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/singout", signOut);

export default router;

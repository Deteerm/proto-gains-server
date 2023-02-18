// @TODO redundant

import express from "express";

import { getExercises, createExercise } from "../../controllers/exerciseControllers/index.js";

const router = express.Router();

router.get("/", getExercises);
router.post("/", createExercise);


export default router;

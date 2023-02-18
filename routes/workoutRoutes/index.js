import express from "express";
import { auth } from "../../middleware/index.js";
import controllers from "../../controllers/workoutControllers/index.js";

const { getWorkouts, createWorkout, deleteWorkout, editWorkout } = controllers;

const router = express.Router();

router.get("/:userId", auth, getWorkouts);
router.post("/:userId", auth, createWorkout);
router.delete("/:workoutId", auth, deleteWorkout);
router.patch("/:workoutId", auth, editWorkout);

export default router;

import mongoose from "mongoose";
import { exerciseSchema } from "../Exercise/index.js";

const { Schema } = mongoose;

const workoutSchema = new Schema({
  exercises: {
    type: [exerciseSchema],
    default: () => ({
      exercise: "",
      setsReps: "",
      rest: "",
      weight: "",
      performance: "",
    }),
  },
  date: {
    type: String,
    default: () => new Date().getDay(),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;

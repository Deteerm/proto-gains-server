import mongoose from "mongoose";

const { Schema } = mongoose;

export const exerciseSchema = new Schema({
  exercise: String,
  setsReps: String,
  rest: String,
  rpe: String,
  weight: String,
  performance: String,
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;

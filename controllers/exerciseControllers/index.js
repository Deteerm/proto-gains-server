import Exercise from "../../models/Exercise/index.js";

export const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json(exercises);
  } catch (error) {
    console.log(error.message);
    res.status(404).json(error.message);
  }
};

export const createExercise = async (req, res) => {
  try {
    const exercises = new Exercise(req.body);
    await exercises.save();
    res.status(201).json(exercises);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

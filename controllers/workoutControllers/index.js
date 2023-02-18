import Workout from "../../models/Workout/index.js";
import User from "../../models/User/index.js";
import autoCatch from "../../utils/auto-catch.js";

const authorizeWithUserId = async (req) => {
  if (!req.userId) return false;

  if (req.userId === req.params.userId) return true;

  if (req.isCoach) {
    const coach = await User.findById(req.userId).populate({
      path: "clients",
      populate: {
        path: "user",
        model: "User",
      },
    });

    return coach.clients?.find(({ user: client }) => {
      return client.id === req.params.userId;
    });
  }

  return false;
};

const authorizeWithWorkoutId = async (req) => {
  if (!req.userId) return false;

  const workout = await Workout.findById(req.params.workoutId).populate("user");

  if (workout.user.id === req.userId) {
    return true;
  }

  if (req.isCoach) {
    const coach = await User.findById(req.userId).populate({
      path: "clients",
      populate: {
        path: "user",
        model: "User",
      },
    });

    return coach.clients?.find(({ user: client }) => {
      return client.id === workout.user.id;
    });
  }

  return false;
};

const getWorkouts = async (req, res) => {
  const authorized = await authorizeWithUserId(req);
  if (!authorized) return res.status(401).json("Unauthorized");

  const user = await User.findById(req.params.userId).populate("workouts");

  return res.status(200).json(user.workouts);
};

const createWorkout = async (req, res) => {
  const authorized = await authorizeWithUserId(req);
  if (!authorized) return res.status(401).json("Unauthorized");

  const workout = new Workout({
    user: req.params.userId,
  });

  await workout.save();

  const _user = await User.findById(req.params.userId);
  _user.workouts.push(workout._id);
  await _user.save();

  return res.status(201).json(workout);
};

const deleteWorkout = async (req, res) => {
  const authorized = await authorizeWithWorkoutId(req);
  if (!authorized) return res.status(401).json("Unauthorized");

  // Use the findOneAndDelete method instead of first finding the workout and then deleting it
  const workout = await Workout.findOneAndDelete({
    _id: req.params.workoutId,
  });

  if (!workout) return res.status(404).json("Not found");

  // Use the $pull operator to remove the workout from the user's workouts array
  await User.findByIdAndUpdate(workout.user._id, {
    $pull: { workouts: workout._id },
  });

  return res.status(200).json(workout);
};

const editWorkout = async (req, res) => {
  const authorized = await authorizeWithWorkoutId(req);
  if (!authorized) return res.status(401).json("Unauthorized");

  const workout = await Workout.findById(req.params.workoutId).exec();

  if (!workout) return res.status(404).json("Not found");

  const { exercises, date } = req.body;

  if (exercises) workout.exercises = exercises;
  if (date) workout.date = date;

  await workout.save();

  return res.status(200).json(workout);
};

export default autoCatch({
  getWorkouts,
  createWorkout,
  editWorkout,
  deleteWorkout,
});

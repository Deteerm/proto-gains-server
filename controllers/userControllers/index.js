import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../../models/User/index.js";
import { TOP_SECRET } from "../../enums/index.js";
import autoCatch from "../../utils/auto-catch.js";

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  await user.populate({
    path: "clients",
    populate: {
      path: "user",
      model: "User",
    },
  });

  if (!user) return res.status(404).json({ message: "User doesn't exist" });

  const isPasswordCorrect = bcrypt.compare(password, user.password);

  if (!isPasswordCorrect)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { email: user.email, id: user._id, isCoach: user.isCoach },
    TOP_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({ result: user, token });
};

const signUp = async (req, res) => {
  const { email, password, name, isCoach, coachesEmail } = req.body;

  const coach = await User.findOne({ email: coachesEmail, isCoach: true });

  if (!isCoach && !coach)
    return res
      .status(400)
      .json({ message: "There is no coach with that email" });

  const existingUser = await User.findOne({ email });

  if (existingUser)
    return res
      .status(400)
      .json({ message: "User with that email already exists" });

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    workouts: [],
    isCoach,
    ...(isCoach ? { clients: [] } : {}),
  });

  if (coach) {
    coach.clients.push({ newClient: true, user: user._id });
    coach.save();
  }

  const token = jwt.sign({ email: user.email, id: user._id }, TOP_SECRET, {
    expiresIn: "1h",
  });

  res.status(201).json({ result: user, token });
};

const signOut = async (req, res) => {
  return res.status(200).json("ok");
};

export default autoCatch({ signIn, signUp, signOut });

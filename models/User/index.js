import mongoose from "mongoose";

const { Schema } = mongoose;

const clientScheema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  newClient: "Boolean",
});

const userSchema = new Schema({
  name: "String",
  email: "String",
  password: "String",
  workouts: {
    type: [mongoose.Types.ObjectId],
    ref: "Workout",
  },
  isCoach: "Boolean",
  clients: {
    type: [clientScheema],
  },
});

const User = mongoose.model("User", userSchema);

export default User;

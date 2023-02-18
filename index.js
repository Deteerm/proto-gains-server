import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import exerciseRoutes from "./routes/exerciseRoutes/index.js";
import workoutRoutes from "./routes/workoutRoutes/index.js";
import userRoutes from "./routes/userRoutes/index.js";
import { handleError, notFound } from "./middleware/index.js";
import { DB_PASSWORD } from "./enums/index.js";

try {
  await mongoose.connect(
    `mongodb+srv://root:${DB_PASSWORD}@cluster0.qsgls9e.mongodb.net/proto-gains-dev?retryWrites=true&w=majority`
  );
  console.log("DB connected");
} catch (error) {
  console.log(error.message);
}

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/exercises", exerciseRoutes);
app.use("/workouts", workoutRoutes);
app.use("/auth", userRoutes);

app.get("/healthCheck", (req, res) => {
  res.status(200).json("It's alive");
  //small change
});

app.use(notFound);
app.use(handleError);

const PORT = 3000;

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

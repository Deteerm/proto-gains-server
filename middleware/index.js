import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.TOP_SECRET;

export const auth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (token) {
      const decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
      req.isCoach = decodedData?.isCoach;
    }

    next();
  } catch (error) {
    console.log(error);
    if (error.message === "jwt expired")
      return res.status(401).json("Unauthorized: your session expired");
    res.status(500).json("Server Error");
  }
};

export function handleError(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Internal Error" });
}

export function notFound(req, res) {
  res.status(404).json({ error: "Not Found" });
}

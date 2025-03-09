import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { recipeRouter } from "./routes/recipe.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", userRouter);
app.use("/recipes", recipeRouter);

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

export default app;

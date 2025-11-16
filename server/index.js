import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { recipeRouter } from "./routes/recipe.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// Updated CORS configuration for Vercel deployment

app.use(express.json());

// Enhanced CORS configuration
app.use(cors({
  origin: ["https://food-hub-silk.vercel.app", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}));

// Additional CORS headers middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "https://food-hub-silk.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

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

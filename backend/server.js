import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import scoreRoutes from "./routes/score.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("ENV CHECK →", process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("Mongo connection failed:", err.message);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);

app.listen(5000, () => console.log("Server running on 5000"));

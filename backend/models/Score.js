import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    score: Number,
    level: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Score", scoreSchema);

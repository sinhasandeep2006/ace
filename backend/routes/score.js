import express from "express";
import Score from "../models/Score.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* -------- CREATE or UPDATE SCORE -------- */
router.put("/", auth, async (req, res) => {
  const { score, level } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json("User not found");

  const updatedScore = await Score.findOneAndUpdate(
    { userId: req.user.id },
    {
      userId: req.user.id,
      name: user.name,
      score,
      level,
    },
    { upsert: true, new: true }
  );

  res.json(updatedScore);
});

/* -------- GET MY SCORE (ME → ME) -------- */
router.get("/me", auth, async (req, res) => {
  const myScore = await Score.findOne({ userId: req.user.id });

  if (!myScore) {
    return res.json({
      score: 0,
      level: 0,
      message: "No score yet",
    });
  }

  res.json(myScore);
});

export default router;

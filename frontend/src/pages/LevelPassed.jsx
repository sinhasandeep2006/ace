import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LevelPassed = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const nextLevel = (state?.level || 1) + 1;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">
        🎉 You have passed this level!
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/game?level=${nextLevel}`)}
          className="px-6 py-2 bg-green-500 text-white rounded-lg"
        >
          Continue
        </button>

        <button
          onClick={() => navigate("/score")}
          className="px-6 py-2 bg-red-500 text-white rounded-lg"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default LevelPassed;

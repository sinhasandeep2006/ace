import React from "react";
import StarBackGround from "../components/StarBackGround";
import { useNavigate } from "react-router-dom"; // optional if using navigation

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Navigate to game page or start logic
    navigate("/game"); 
  };

  const handleShowScore = () => {
    // Navigate to score page or show score logic
    navigate("/score"); 
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-black">
      {/* Star background */}
      <StarBackGround />

      {/* Content on top of stars */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-center">
           Save the day
        </h1>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Start
          </button>
          <button
            onClick={handleShowScore}
            className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Show Score
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

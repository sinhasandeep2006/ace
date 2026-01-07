import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import heroImg from "../assets/hero.png";
import bg from "./bg4.webp"
export default function Score() {
  const navigate = useNavigate();

  const [scoreData, setScoreData] = useState({ score: 0, level: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://ace-76pn.onrender.com/api/score/me",
          {
            headers: {
              Authorization: token, // ✅ IMPORTANT FIX
            },
          }
        );

        setScoreData(res.data);
      } catch (err) {
        console.error("Failed to fetch score:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
                backgroundImage:`url(${bg})`,
                backgroundSize:'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }} className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-black/60 rounded-2xl shadow-xl px-8 py-10 text-center w-[90%] max-w-md">
        <img src={heroImg} alt="Hero" className="w-40 mx-auto mb-6" />

        <h1 className="text-3xl font-bold text-white mb-4">🏆 Game Over</h1>

        <div className="text-lg text-gray-300 mb-6 space-y-2">
          <p>
            Highest Level:{" "}
            <span className="text-orange-400 font-bold">
              {scoreData.level}
            </span>
          </p>
          <p>
            Final Score:{" "}
            <span className="text-green-400 font-bold">
              {scoreData.score}
            </span>
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/game")}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}

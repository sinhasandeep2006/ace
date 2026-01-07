import { useEffect, useRef, useState } from "react";
import axios from "axios";

import heroImg from "../assets/hero.png";
import villainImg from "../assets/villion.png";

export default function Game() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const animationRef = useRef(null);

  const heroImgRef = useRef(new Image());
  const villainImgRef = useRef(new Image());

  const villainRef = useRef(null);
  const bulletsRef = useRef([]);
  const lastFireRef = useRef(0);
  const killsRef = useRef(0);

  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);

  const HERO_W = 100;
  const HERO_H = 100;

  const hero = {
    x: 30,
    y: 0, // set dynamically
    w: HERO_W,
    h: HERO_H,
  };

  /* ---------- LOAD IMAGES ---------- */
  useEffect(() => {
    heroImgRef.current.src = heroImg;
    villainImgRef.current.src = villainImg;
  }, []);

  /* ---------- RESIZE (FIXED) ---------- */
  function resizeCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const cssWidth = Math.min(window.innerWidth - 24, 420);
    const cssHeight = 240;

    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // ✅ RESET SCALE
    ctxRef.current = ctx;

    hero.y = cssHeight / 2 - hero.h / 2; // ✅ TRUE CENTER
  }

  /* ---------- SPAWN VILLAIN ---------- */
  function spawnVillain() {
    const canvas = canvasRef.current;

    villainRef.current = {
      x: canvas.width / (window.devicePixelRatio || 1) - 70, // ✅ RIGHT EDGE
      y: hero.y, // ✅ SAME Y AXIS
      w: 100,
      h: 100,
      speed: level === 3 ? Math.random() * 6 + 5 : 2 + level,
      chaosTimer: 0,
    };
  }

  /* ---------- FIRE (0.5s delay) ---------- */
  function fire() {
    const now = Date.now();
    if (now - lastFireRef.current < 500) return;

    lastFireRef.current = now;
    bulletsRef.current.push({
      x: hero.x + hero.w,
      y: hero.y + hero.h / 2,
    });
  }

  /* ---------- GAME LOOP ---------- */
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    spawnVillain();
    killsRef.current = 0;

    function loop() {
      if (levelComplete) return;

      const ctx = ctxRef.current;
      const canvas = canvasRef.current;

      ctx.clearRect(
        0,
        0,
        canvas.width / devicePixelRatio,
        canvas.height / devicePixelRatio
      );

      // HERO
      ctx.drawImage(heroImgRef.current, hero.x, hero.y, hero.w, hero.h);

      const villain = villainRef.current;

      // VILLAIN
      if (villain) {
        if (level === 3) {
          villain.chaosTimer++;
          if (villain.chaosTimer % 12 === 0) {
            villain.speed = Math.random() * 8 + 4;
          }
        }

        villain.x -= villain.speed;
        ctx.drawImage(villainImgRef.current, villain.x, villain.y, villain.w, villain.h);

        if (villain.x <= hero.x + hero.w) {
          endGame();
          return;
        }
      }

      // BULLETS
      bulletsRef.current = bulletsRef.current.filter((b) => {
        b.x += 6;
        ctx.fillStyle = "orange";
        ctx.fillRect(b.x, b.y, 8, 4);

        if (villain && b.x < villain.x + villain.w && b.x + 8 > villain.x) {
          villainRef.current = null;
          bulletsRef.current = [];

          killsRef.current++;
          setKills(killsRef.current);
          setScore((s) => s + 5);

          if (killsRef.current >= 5) {
            levelPassed();
            return false;
          }

          setTimeout(spawnVillain, 300);
          return false;
        }
        return true;
      });

      animationRef.current = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [level, levelComplete]);

  /* ---------- GAME LOGIC ---------- */
  function levelPassed() {
    cancelAnimationFrame(animationRef.current);
    saveScore(level, score);
    setLevelComplete(true);
  }

  function continueNextLevel() {
    if (level === 3) return endGame();
    killsRef.current = 0;
    bulletsRef.current = [];
    setKills(0);
    setLevelComplete(false);
    setLevel((l) => l + 1);
  }

  function endGame() {
    cancelAnimationFrame(animationRef.current);
    saveScore(level, score);
    alert("💀 You Lost!");
    window.location.href = "/score";
  }

  function saveScore(lvl, scr) {
    axios.put(
      "https://ace-76pn.onrender.com/api/score",
      { level: lvl, score: scr },
      { headers: { Authorization: localStorage.getItem("token") } }
    );
  }

  return (
    <div className="min-h-screen bg-gray-700 flex flex-col">
      <h3 className="text-center text-white py-3">
        Level: {level} | Score: {score} | Kills: {kills}
      </h3>

      <div className="flex-1 flex items-center justify-center">
        <canvas ref={canvasRef} className="bg-gray-500 rounded-xl shadow-lg" />
      </div>

      <div className="pb-6 flex justify-center">
        <button
          onClick={fire}
          className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg"
        >
          🔥 FIRE
        </button>
      </div>

      {levelComplete && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 text-white">
          <h1 className="text-3xl font-bold mb-4">🎉 Level {level} Completed</h1>
          <button
            onClick={continueNextLevel}
            className="px-6 py-2 bg-green-500 rounded-lg"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

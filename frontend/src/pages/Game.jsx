import { useEffect, useRef, useState } from "react";
import axios from "axios";

import heroImg from "../assets/hero.png";
import villainImg from "../assets/villion.png";
import bg from "./bg2.png";

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

  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(true);

  const HERO_W = 100;
  const HERO_H = 100;

  const hero = {
    x: 30,
    y: 0,
    w: HERO_W,
    h: HERO_H,
  };

  /* ---------- LOAD IMAGES ---------- */
  useEffect(() => {
    heroImgRef.current.src = heroImg;
    villainImgRef.current.src = villainImg;
  }, []);

  /* ---------- RESIZE ---------- */
  function resizeCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const cssW = 400;
    const cssH = 400;

    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctxRef.current = ctx;

    hero.y = cssH / 2 - hero.h / 2;
  }

  /* ---------- COUNTDOWN ---------- */
  useEffect(() => {
    setIsCounting(true);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c === 1) {
          clearInterval(timer);
          setIsCounting(false);
          spawnVillain();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level]);

  /* ---------- SPAWN VILLAIN ---------- */
  function spawnVillain() {
    const canvas = canvasRef.current;
    villainRef.current = {
      x: canvas.width / (window.devicePixelRatio || 1) - 70,
      y: hero.y,
      w: 100,
      h: 100,
      speed: level === 3 ? Math.random() * 6 + 5 : 2 + level,
      chaosTimer: 0,
    };
  }

  /* ---------- FIRE ---------- */
  function fire() {
    if (isCounting || levelComplete) return;

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

    killsRef.current = 0;

    function loop() {
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

      if (!isCounting && villainRef.current) {
        const v = villainRef.current;

        if (level === 3) {
          v.chaosTimer++;
          if (v.chaosTimer % 12 === 0) {
            v.speed = Math.random() * 8 + 4;
          }
        }

        v.x -= v.speed;
        ctx.drawImage(villainImgRef.current, v.x, v.y, v.w, v.h);

        if (v.x <= hero.x + hero.w) {
          endGame();
          return;
        }
      }

      // BULLETS
      bulletsRef.current = bulletsRef.current.filter((b) => {
        b.x += 6;
        ctx.fillStyle = "orange";
        ctx.fillRect(b.x, b.y, 8, 4);

        const v = villainRef.current;
        if (v && b.x < v.x + v.w && b.x + 8 > v.x) {
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
  }, [level, isCounting]);

  /* ---------- GAME STATE ---------- */
  function levelPassed() {
    cancelAnimationFrame(animationRef.current);
    saveScore(level, score);
    setLevelComplete(true);
  }

  function continueNextLevel() {
    if (level === 3) return endGame();

    bulletsRef.current = [];
    killsRef.current = 0;
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
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
      }}
      className="min-h-screen flex flex-col"
    >
      <h3 className="text-center text-white py-3">
        Level: {level} | Score: {score} | Kills: {kills}
      </h3>

      <div className="flex-1 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="bg-black/60 border rounded-xl shadow-lg"
        />
      </div>

      <div className="pb-6 flex justify-center">
        <button
          onClick={fire}
          className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg"
        >
          🔥 FIRE
        </button>
      </div>

      {isCounting && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <h1 className="text-7xl font-extrabold text-orange-400 animate-pulse">
            {countdown === 0 ? "GO!" : countdown}
          </h1>
        </div>
      )}

      {levelComplete && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 text-white">
          <h1 className="text-3xl font-bold mb-4">
            🎉 Level {level} Completed
          </h1>
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

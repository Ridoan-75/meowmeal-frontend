"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DURATION = 3600;

const STEPS = [
  { label: "Initializing kitchen", pct: 0.08 },
  { label: "Sourcing ingredients",  pct: 0.36 },
  { label: "Cooking your order",    pct: 0.68 },
  { label: "Plating & dispatching", pct: 0.94 },
];

const BAR_COUNT = 20;

const BAR_SPEEDS = [
  "1.1s","0.9s","1.3s","0.8s","1.0s","1.4s","0.95s","1.2s","0.85s","1.05s",
  "1.15s","0.92s","1.25s","0.88s","1.08s","1.35s","0.97s","1.18s","0.83s","1.02s",
];
const BAR_DELAYS = [
  "0s","0.15s","0.30s","0.05s","0.22s","0.08s","0.38s","0.12s","0.28s","0.18s",
  "0.42s","0.07s","0.25s","0.35s","0.03s","0.20s","0.10s","0.32s","0.17s","0.40s",
];

export function PageLoader() {
  const [step, setStep]         = useState(0);
  const [exit, setExit]         = useState(false);
  const [visible, setVisible]   = useState(true);
  const [labelKey, setLabelKey] = useState(0);

  useEffect(() => {
    const stepMs = DURATION / STEPS.length;

    const stepIv = setInterval(() => {
      setStep((s) => {
        if (s < STEPS.length - 1) { setLabelKey((k) => k + 1); return s + 1; }
        return s;
      });
    }, stepMs);

    const exitTimer = setTimeout(() => setExit(true), DURATION - 400);
    const hideTimer = setTimeout(() => setVisible(false), DURATION + 150);

    return () => {
      clearInterval(stepIv);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  const activeBarCount = Math.round(((step + 1) / STEPS.length) * BAR_COUNT);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .pl-scene { font-family: 'DM Sans', sans-serif; }

        @keyframes pl-ring-cw  { from { transform: rotate(0deg) }   to { transform: rotate(360deg) } }
        @keyframes pl-ring-ccw { from { transform: rotate(0deg) }   to { transform: rotate(-360deg) } }

        @keyframes pl-core-pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1);    opacity: .9; }
          50%       { transform: translate(-50%,-50%) scale(1.06); opacity: 1;  }
        }

        @keyframes pl-scan {
          0%   { top: 0%;   opacity: .7;  }
          80%  {             opacity: .15; }
          100% { top: 100%; opacity: 0;   }
        }

        @keyframes pl-label-in {
          from { opacity: 0; transform: translateY(7px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        @keyframes pl-halo {
          0%, 100% { opacity: .06; transform: scale(1);    }
          50%       { opacity: .13; transform: scale(1.06); }
        }

        @keyframes pl-shimmer-word {
          0%, 100% { opacity: .72; }
          50%       { opacity: 1;   }
        }

        @keyframes pl-wave {
          0%, 100% { transform: scaleY(.22); opacity: .28; }
          50%       { transform: scaleY(1);  opacity: 1;   }
        }

        @keyframes pl-exit {
          to { opacity: 0; transform: scale(1.05) translateY(-6px); filter: blur(3px); }
        }

        .pl-exit-anim  { animation: pl-exit .5s cubic-bezier(.4,0,1,1) forwards !important; }
        .pl-label-anim { animation: pl-label-in .4s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <div
        className={`pl-scene fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden${exit ? " pl-exit-anim" : ""}`}
        style={{ background: "linear-gradient(160deg,#080808 0%,#100800 55%,#080808 100%)" }}
      >
        {/* Ambient halo */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 52% 44% at 50% 50%, rgba(251,100,48,.17) 0%, transparent 68%)",
            animation: "pl-halo 3.2s ease-in-out infinite",
          }}
        />

        {/* Ring system */}
        <div style={{ position: "relative", width: 200, height: 200 }}>

          {/* Outer ring — clockwise */}
          <div style={{ position: "absolute", inset: 0, animation: "pl-ring-cw 7s linear infinite" }}>
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
              <defs>
                <linearGradient id="plG1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#fb6430" stopOpacity="0" />
                  <stop offset="60%"  stopColor="#fb6430" stopOpacity=".9" />
                  <stop offset="100%" stopColor="#ffbe50" stopOpacity=".55" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="95" stroke="rgba(255,255,255,.05)" strokeWidth="1" />
              <circle
                cx="100" cy="100" r="95"
                stroke="url(#plG1)" strokeWidth="1.6"
                strokeLinecap="round" strokeDasharray="220 377"
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="5" r="3.5" fill="#fb6430" opacity=".95" />
            </svg>
          </div>

          {/* Mid ring — counter-clockwise */}
          <div style={{ position: "absolute", inset: 18, animation: "pl-ring-ccw 4.5s linear infinite" }}>
            <svg width="164" height="164" viewBox="0 0 164 164" fill="none">
              <defs>
                <linearGradient id="plG2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#ffbe50" stopOpacity="0" />
                  <stop offset="100%" stopColor="#ffbe50" stopOpacity=".65" />
                </linearGradient>
              </defs>
              <circle cx="82" cy="82" r="77" stroke="rgba(255,255,255,.04)" strokeWidth="1" />
              <circle
                cx="82" cy="82" r="77"
                stroke="url(#plG2)" strokeWidth="1.2"
                strokeLinecap="round" strokeDasharray="110 374"
                transform="rotate(60 82 82)"
              />
              <circle cx="159" cy="82" r="2.8" fill="#ffbe50" opacity=".8" />
            </svg>
          </div>

          {/* Inner dashed ring — static */}
          <div style={{ position: "absolute", inset: 42 }}>
            <svg width="116" height="116" viewBox="0 0 116 116" fill="none">
              <circle cx="58" cy="58" r="53" stroke="rgba(251,100,48,.1)" strokeWidth="1" strokeDasharray="4 9" />
            </svg>
          </div>

          {/* Core — 88x88 with 64px logo */}
          <div
            style={{
              position: "absolute", top: "50%", left: "50%",
              width: 88, height: 88, borderRadius: 22,
              background: "linear-gradient(135deg,#160b00,#241100)",
              border: "1px solid rgba(251,100,48,.32)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
              animation: "pl-core-pulse 2.6s ease-in-out infinite",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute", left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg,transparent,rgba(251,100,48,.7),transparent)",
                animation: "pl-scan 2.2s ease-in-out infinite",
              }}
            />
            <Image
              src="/logo.png"
              alt="meowmeal"
              width={200}
              height={200}
              style={{ position: "relative", zIndex: 1, borderRadius: 14, objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Info section */}
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

          {/* Wordmark */}
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: "-0.045em",
              margin: 0,
              animation: "pl-shimmer-word 3.2s ease-in-out infinite",
              background: "linear-gradient(90deg,#b0b0b0 0%,#ffffff 42%,#909090 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            meow<span style={{ WebkitTextFillColor: "#fb6430" }}>meal</span>
          </h1>

          {/* Step label */}
          <p
            key={labelKey}
            className="pl-label-anim"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.35)",
              margin: 0,
              textAlign: "center",
            }}
          >
            {STEPS[step].label}
          </p>

          {/* Pulsing wave bars */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, height: 32 }}>
            {Array.from({ length: BAR_COUNT }).map((_, i) => {
              const isActive = i < activeBarCount;
              return (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: 32,
                    borderRadius: 99,
                    background: isActive
                      ? "linear-gradient(180deg,#ffbe50,#fb6430)"
                      : "rgba(255,255,255,.1)",
                    transformOrigin: "center",
                    opacity: isActive ? 1 : 0.35,
                    animation: `pl-wave ${BAR_SPEEDS[i]} ease-in-out ${BAR_DELAYS[i]} infinite`,
                    transition: "background 0.5s ease, opacity 0.5s ease",
                  }}
                />
              );
            })}
          </div>

          {/* Step dots */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 3.5,
                  borderRadius: 99,
                  background: i === step
                    ? "linear-gradient(90deg,#fb6430,#ffbe50)"
                    : i < step
                    ? "rgba(251,100,48,.3)"
                    : "rgba(255,255,255,.1)",
                  width: i === step ? 20 : 4,
                  transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                  boxShadow: i === step ? "0 0 6px rgba(251,100,48,.4)" : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p
          style={{
            position: "absolute",
            bottom: 24,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,.1)",
          }}
        >
          Fresh food · Fast delivery
        </p>
      </div>
    </>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import BackHeader from "../BackHeader";
import { colors } from "@/lib/theme";
import type { IconName, Server } from "@/lib/data";

interface Phase {
  key: string;
  label: string;
  icon: IconName;
  unit: string;
  durationMs: number;
}

const PHASES: Phase[] = [
  { key: "ping", label: "Testing ping", icon: "bolt", unit: "ms", durationMs: 900 },
  { key: "jitter", label: "Testing jitter", icon: "wave-square", unit: "ms", durationMs: 800 },
  { key: "loss", label: "Testing packet loss", icon: "triangle-exclamation", unit: "%", durationMs: 800 },
  { key: "download", label: "Testing download", icon: "download", unit: "Mbps", durationMs: 1400 },
  { key: "upload", label: "Testing upload", icon: "upload", unit: "Mbps", durationMs: 1200 },
];

function randomizeResult(key: string, server: Server) {
  const ping = server.ping ?? 0;
  const jitter = server.jitter ?? 0;
  const load = server.load ?? 0;
  switch (key) {
    case "ping":
      return Math.max(8, Math.round(ping + (Math.random() * 6 - 3)));
    case "jitter":
      return Math.max(1, Math.round(jitter + (Math.random() * 2 - 1)));
    case "loss":
      return Math.max(0, +(server.packetLoss + Math.random() * 0.2).toFixed(1));
    case "download":
      return Math.round(60 + Math.random() * 70 - load * 0.3);
    case "upload":
      return Math.round(15 + Math.random() * 25 - load * 0.1);
    default:
      return 0;
  }
}

export default function SpeedTestScreen({
  server,
  onBack,
  onComplete,
}: {
  server: Server;
  onBack: () => void;
  onComplete?: (results: Record<string, number>) => void;
}) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const reportedRef = useRef(false);

  useEffect(() => {
    if (done || phaseIndex >= PHASES.length) return;
    const phase = PHASES[phaseIndex];
    const tickMs = 40;
    const steps = phase.durationMs / tickMs;
    let step = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets the bar to 0% as each new phase's interval starts
    setProgress(0);

    const id = setInterval(() => {
      step += 1;
      setProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        clearInterval(id);
        const value = randomizeResult(phase.key, server);
        setResults((r) => ({ ...r, [phase.key]: value }));
        if (phaseIndex + 1 >= PHASES.length) {
          setDone(true);
        } else {
          setPhaseIndex((i) => i + 1);
        }
      }
    }, tickMs);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex, done]);

  useEffect(() => {
    if (done && !reportedRef.current) {
      reportedRef.current = true;
      onComplete?.(results);
    }
  }, [done, results, onComplete]);

  const rerun = () => {
    setPhaseIndex(0);
    setProgress(0);
    setResults({});
    setDone(false);
    reportedRef.current = false;
  };

  return (
    <div>
      <BackHeader title="Speed Test" onBack={onBack} />
      <div className="px-5">
        {!done ? (
          <div className="bg-white/6 rounded-[20px] py-10 flex flex-col items-center gap-3.5">
            <Icon name={PHASES[phaseIndex].icon} size={28} color={colors.orange} />
            <p className="f-semibold text-[15px] text-white">{PHASES[phaseIndex].label}…</p>
            <div className="w-4/5 h-2 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full bg-royal-orange rounded-full transition-[width]" style={{ width: `${progress}%` }} />
            </div>
            <p className="f-regular text-xs text-white/50">{progress}%</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2.5 mb-5">
              {PHASES.map((p) => (
                <div key={p.key} className="w-[calc(50%-5px)] bg-white/5 rounded-2xl p-4 flex flex-col items-start gap-1.5">
                  <Icon name={p.icon} size={14} color={colors.orange} />
                  <p className="f-extrabold text-xl text-white">
                    {results[p.key]}
                    <span className="f-regular text-xs text-white/50"> {p.unit}</span>
                  </p>
                  <p className="f-regular text-xs text-white/60 capitalize">{p.label.replace("Testing ", "")}</p>
                </div>
              ))}
            </div>
            <button onClick={rerun} className="w-full flex items-center justify-center gap-2 bg-royal-orange rounded-full py-3">
              <Icon name="arrow-rotate-right" size={14} color="#000" />
              <span className="f-bold text-sm text-black">Run Again</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

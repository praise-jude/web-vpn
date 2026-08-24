"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "../Icon";
import BackHeader from "../BackHeader";
import { colors } from "@/lib/theme";
import { formatRelativeTime } from "@/lib/utils";
import { checkReachability, type ReachabilityResult } from "@/lib/trustedServices";
import type { TrustedService } from "@/lib/data";

type TestState = Record<string, ReachabilityResult & { testing: boolean }>;

export default function TradingConnectionTestScreen({
  services,
  vpnServerLabel,
  protocolLabel,
  onBack,
}: {
  services: TrustedService[];
  vpnServerLabel: string;
  protocolLabel: string;
  onBack: () => void;
}) {
  const [results, setResults] = useState<TestState>({});

  const runTests = useCallback(() => {
    services
      .filter((s) => s.enabled)
      .forEach((service) => {
        setResults((r) => ({ ...r, [service.id]: { ok: false, latencyMs: null, checkedAt: Date.now(), testing: true } }));
        checkReachability(service.domain).then((result) => {
          setResults((r) => ({ ...r, [service.id]: { ...result, testing: false } }));
        });
      });
  }, [services]);

  useEffect(() => {
    runTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enabledServices = services.filter((s) => s.enabled);

  return (
    <div>
      <BackHeader title="Trading Connection Test" onBack={onBack} />
      <div className="px-5 pb-6">
        <div className="bg-white/6 rounded-2xl p-3.5 mb-3">
          <p className="f-regular text-xs text-white/60">
            Route: <span className="f-medium text-white">{vpnServerLabel}</span> · {protocolLabel}
          </p>
        </div>

        <div className="flex items-start gap-2.5 bg-white/6 rounded-2xl p-3.5 mb-4">
          <Icon name="circle-info" size={13} color="rgba(255,255,255,0.6)" className="mt-0.5 shrink-0" />
          <p className="f-regular text-[11px] text-white/60 leading-[16px]">
            Some sites limit this kind of background check as their own security measure. If a service shows Unreachable here
            but opens fine when you visit it directly, that&apos;s the likely reason — not a sign Royal-VPN is blocking it.
          </p>
        </div>

        {enabledServices.length === 0 && (
          <p className="f-regular text-[13px] text-white/50 text-center py-6">No trusted services are enabled to test.</p>
        )}

        <div className="flex flex-col gap-2.5 mb-5">
          {enabledServices.map((service) => {
            const result = results[service.id];
            const status = !result || result.testing ? "testing" : result.ok ? "ok" : "fail";
            return (
              <div key={service.id} className="bg-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="f-semibold text-sm text-white">{service.name}</p>
                  {status === "testing" ? (
                    <span className="f-semibold text-xs text-white/50">Testing…</span>
                  ) : status === "ok" ? (
                    <span className="flex items-center gap-1.5">
                      <Icon name="circle-check" size={13} color={colors.green} />
                      <span className="f-semibold text-xs text-royal-green">Reachable</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Icon name="circle-xmark" size={13} color={colors.red} />
                      <span className="f-semibold text-xs text-royal-red">Unreachable</span>
                    </span>
                  )}
                </div>
                <p className="f-regular text-xs text-white/45 mb-2">{service.domain}</p>
                <div className="flex items-center gap-4">
                  <p className="f-regular text-[11px] text-white/45">
                    Latency: <span className="f-medium text-white/70">{result?.latencyMs != null ? `${result.latencyMs} ms` : "—"}</span>
                  </p>
                  <p className="f-regular text-[11px] text-white/45">
                    Last tested: <span className="f-medium text-white/70">{result ? formatRelativeTime(result.checkedAt) : "—"}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={runTests} className="w-full flex items-center justify-center gap-2 bg-royal-orange rounded-full py-3">
          <Icon name="arrow-rotate-right" size={13} color="#000" />
          <span className="f-bold text-sm text-black">Run Test Again</span>
        </button>
      </div>
    </div>
  );
}

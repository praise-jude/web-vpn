"use client";

import { useState } from "react";
import Icon from "../Icon";
import BackHeader from "../BackHeader";
import Toggle from "../Toggle";
import { colors } from "@/lib/theme";
import { formatRelativeTime } from "@/lib/utils";
import { isValidDomain, lookalikeWarning, normalizeDomain } from "@/lib/trustedServices";
import type { TrustedService } from "@/lib/data";

export interface TrustedServiceAuditEntry {
  id: string;
  label: string;
  time: number;
}

export default function TrustedServicesScreen({
  services,
  allowDuringReconnect,
  auditLog,
  onBack,
  onToggleService,
  onRemoveService,
  onAddService,
  onToggleReconnectPolicy,
  onOpenTest,
}: {
  services: TrustedService[];
  allowDuringReconnect: boolean;
  auditLog: TrustedServiceAuditEntry[];
  onBack: () => void;
  onToggleService: (id: string) => void;
  onRemoveService: (id: string) => void;
  onAddService: (name: string, domain: string, includeSubdomains: boolean) => void;
  onToggleReconnectPolicy: () => void;
  onOpenTest: () => void;
}) {
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [includeSubdomains, setIncludeSubdomains] = useState(false);
  const [formError, setFormError] = useState("");

  const normalizedDomain = normalizeDomain(domain);
  const warning = normalizedDomain && isValidDomain(normalizedDomain) ? lookalikeWarning(normalizedDomain, services) : null;

  const handleSubmitAdd = () => {
    setFormError("");
    if (!name.trim()) {
      setFormError("Give this trusted service a name.");
      return;
    }
    if (!normalizedDomain || !isValidDomain(normalizedDomain)) {
      setFormError("Enter a valid domain, like example.com.");
      return;
    }
    if (services.some((s) => s.domain === normalizedDomain)) {
      setFormError("That domain is already on the list.");
      return;
    }
    onAddService(name.trim(), normalizedDomain, includeSubdomains);
    setName("");
    setDomain("");
    setIncludeSubdomains(false);
    setShowAddForm(false);
  };

  return (
    <div>
      <BackHeader title="Trusted Trading" onBack={onBack} />
      <div className="px-5 pb-6">
        <div className="flex items-start gap-2.5 bg-white/6 rounded-2xl p-3.5 mb-4">
          <Icon name="circle-info" size={14} color="rgba(255,255,255,0.6)" className="mt-0.5 shrink-0" />
          <p className="f-regular text-xs text-white/60 leading-[17px]">
            These preferences keep the domains below reachable while Royal-VPN is connected. They don&apos;t change how the rest of
            your traffic is protected — everything else still goes through the normal Royal-VPN tunnel.
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl overflow-hidden mb-4">
          {services.map((service, i) => (
            <div key={service.id}>
              {confirmRemoveId === service.id ? (
                <div className={`flex items-center gap-3 py-3.5 px-4 ${i < services.length - 1 ? "border-b border-white/8" : ""}`}>
                  <p className="flex-1 f-medium text-[13px] text-white">Remove {service.name}?</p>
                  <button onClick={() => setConfirmRemoveId(null)} className="f-semibold text-xs text-white/60 py-1.5 px-2">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onRemoveService(service.id);
                      setConfirmRemoveId(null);
                    }}
                    className="f-semibold text-xs text-royal-red py-1.5 px-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className={`flex items-center gap-3 py-3.5 px-4 ${i < services.length - 1 ? "border-b border-white/8" : ""}`}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: service.enabled ? colors.green : "rgba(255,255,255,0.3)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="f-semibold text-sm text-white">{service.name}</p>
                    <p className="f-regular text-xs text-white/50 mt-0.5 truncate">
                      {service.domain}
                      {service.includeSubdomains ? " · includes subdomains" : ""}
                    </p>
                  </div>
                  <Toggle value={service.enabled} onToggle={() => onToggleService(service.id)} />
                  <button
                    onClick={() => setConfirmRemoveId(service.id)}
                    aria-label={`Remove ${service.name}`}
                    className="shrink-0"
                  >
                    <Icon name="trash" size={13} color="rgba(255,255,255,0.35)" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {showAddForm ? (
          <div className="bg-white/5 rounded-2xl p-4 mb-4">
            <p className="f-semibold text-sm text-white mb-3">Add Trusted Domain</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Service name"
              className="w-full f-regular text-sm text-white placeholder:text-white/40 bg-white/6 rounded-xl py-2.5 px-3.5 mb-2.5 outline-none"
            />
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="w-full f-regular text-sm text-white placeholder:text-white/40 bg-white/6 rounded-xl py-2.5 px-3.5 mb-2.5 outline-none"
            />
            <button
              onClick={() => setIncludeSubdomains((v) => !v)}
              className="w-full flex items-center gap-2.5 mb-3 text-left"
            >
              <span
                className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 ${includeSubdomains ? "bg-royal-orange border-royal-orange" : "border-white/25"}`}
              >
                {includeSubdomains && <Icon name="check" size={10} color="#000" />}
              </span>
              <span className="f-regular text-xs text-white/70">Include all subdomains (*.{normalizedDomain || "domain.com"})</span>
            </button>

            {warning && (
              <div className="flex items-start gap-2 bg-[rgba(234,179,8,0.12)] border border-[rgba(234,179,8,0.3)] rounded-xl p-3 mb-3">
                <Icon name="triangle-exclamation" size={12} color={colors.yellow} className="mt-0.5 shrink-0" />
                <p className="f-regular text-[11px] text-white/80 leading-[16px]">{warning}</p>
              </div>
            )}
            {formError && <p className="f-regular text-xs text-royal-red mb-3">{formError}</p>}

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormError("");
                }}
                className="flex-1 bg-white/8 rounded-full py-2.5"
              >
                <span className="f-semibold text-sm text-white">Cancel</span>
              </button>
              <button onClick={handleSubmitAdd} className="flex-1 bg-royal-orange rounded-full py-2.5">
                <span className="f-semibold text-sm text-black">Add</span>
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddForm(true)} className="w-full flex items-center justify-center gap-2 bg-white/6 rounded-full py-3 mb-4">
            <Icon name="plus" size={12} color="#fff" />
            <span className="f-semibold text-sm text-white">Add Trusted Domain</span>
          </button>
        )}

        <button onClick={onOpenTest} className="w-full flex items-center gap-2.5 bg-white/6 rounded-xl py-3 px-3.5 mb-5 text-left">
          <Icon name="gauge-high" size={14} color={colors.orange} />
          <span className="flex-1 f-semibold text-[13px] text-white">Test Connections</span>
          <Icon name="chevron-right" size={12} color="rgba(255,255,255,0.3)" />
        </button>

        <div className="flex items-center justify-between bg-white/5 rounded-2xl py-3.5 px-4 mb-5">
          <div className="flex-1 pr-3">
            <p className="f-semibold text-sm text-white">Allow trusted services during VPN reconnect</p>
            <p className="f-regular text-[11px] text-white/45 mt-1 leading-[15px]">
              With Kill Switch on, a dropped VPN normally blocks everything. Enabling this lets only the services above use a
              fallback route while Royal-VPN reconnects — everything else stays blocked.
            </p>
          </div>
          <Toggle value={allowDuringReconnect} onToggle={onToggleReconnectPolicy} />
        </div>

        {auditLog.length > 0 && (
          <>
            <h2 className="f-bold text-[11px] text-white/50 tracking-wide mb-2">RECENT CHANGES</h2>
            <div className="bg-white/5 rounded-2xl overflow-hidden">
              {auditLog.slice(0, 8).map((entry, i, arr) => (
                <div key={entry.id} className={`flex items-center gap-2.5 py-3 px-4 ${i < arr.length - 1 ? "border-b border-white/8" : ""}`}>
                  <Icon name="clock" size={12} color="rgba(255,255,255,0.45)" className="shrink-0" />
                  <span className="flex-1 f-medium text-[12.5px] text-white truncate">{entry.label}</span>
                  <span className="f-regular text-[11px] text-white/45 shrink-0">{formatRelativeTime(entry.time)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

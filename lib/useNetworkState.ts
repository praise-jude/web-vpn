"use client";

import { useSyncExternalStore } from "react";

export type NetworkType = "WIFI" | "CELLULAR" | "NONE" | "UNKNOWN";

interface NetworkConnection extends EventTarget {
  type?: string;
  effectiveType?: string;
}

function getConnection() {
  return (navigator as Navigator & { connection?: NetworkConnection }).connection;
}

function getSnapshot(): NetworkType {
  if (!navigator.onLine) return "NONE";
  const type = getConnection()?.type;
  if (type === "wifi" || type === "ethernet") return "WIFI";
  if (type === "cellular") return "CELLULAR";
  return "UNKNOWN";
}

function getServerSnapshot(): NetworkType {
  return "UNKNOWN";
}

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  const connection = getConnection();
  connection?.addEventListener?.("change", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
    connection?.removeEventListener?.("change", callback);
  };
}

export function useNetworkState() {
  const type = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { type };
}

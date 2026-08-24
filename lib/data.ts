export type IconName =
  | "house"
  | "server"
  | "shield-halved"
  | "mobile-screen-button"
  | "gear"
  | "bolt"
  | "scale-balanced"
  | "user-secret"
  | "globe"
  | "comment"
  | "chart-line"
  | "video"
  | "print"
  | "building-columns"
  | "rectangle-ad"
  | "satellite-dish"
  | "bug"
  | "user-secret"
  | "power-off"
  | "arrows-rotate"
  | "wifi"
  | "signal"
  | "gauge-high"
  | "user"
  | "door-open"
  | "door-closed"
  | "wave-square"
  | "triangle-exclamation"
  | "download"
  | "upload"
  | "circle-check"
  | "circle-xmark"
  | "ban"
  | "circle-question"
  | "bell"
  | "headset"
  | "lock"
  | "bug-slash"
  | "shuffle"
  | "route"
  | "fingerprint"
  | "crown"
  | "chevron-left"
  | "chevron-right"
  | "star"
  | "magnifying-glass"
  | "plus"
  | "trash"
  | "check"
  | "arrow-rotate-right"
  | "wand-magic-sparkles"
  | "circle-info"
  | "clock"
  | "xmark";

export interface Server {
  id: string;
  country: string;
  city: string;
  ping: number;
  load: number;
  packetLoss: number;
  jitter: number;
}

export const servers: Server[] = [
  { id: "lagos", country: "Nigeria", city: "Lagos", ping: 22, load: 34, packetLoss: 0.1, jitter: 2 },
  { id: "london", country: "United Kingdom", city: "London", ping: 48, load: 51, packetLoss: 0.3, jitter: 4 },
  { id: "newyork", country: "United States", city: "New York", ping: 61, load: 40, packetLoss: 0.2, jitter: 5 },
  { id: "california", country: "United States", city: "California", ping: 74, load: 28, packetLoss: 0.1, jitter: 3 },
  { id: "frankfurt", country: "Germany", city: "Frankfurt", ping: 39, load: 62, packetLoss: 0.4, jitter: 6 },
  { id: "toronto", country: "Canada", city: "Toronto", ping: 58, load: 20, packetLoss: 0.1, jitter: 3 },
  { id: "paris", country: "France", city: "Paris", ping: 44, load: 45, packetLoss: 0.2, jitter: 4 },
  { id: "singapore", country: "Singapore", city: "Singapore", ping: 120, load: 33, packetLoss: 0.3, jitter: 7 },
  { id: "tokyo", country: "Japan", city: "Tokyo", ping: 135, load: 30, packetLoss: 0.2, jitter: 6 },
];

export interface ConnectionMode {
  key: string;
  label: string;
  icon: IconName;
  tagline: string;
  protocolLabel: string;
  hops: number;
  latencyPenalty: number;
}

export const connectionModes: ConnectionMode[] = [
  {
    key: "speed",
    label: "Speed",
    icon: "bolt",
    tagline: "Single-hop · fastest server · minimal overhead",
    protocolLabel: "WireGuard · Single-hop",
    hops: 1,
    latencyPenalty: 0,
  },
  {
    key: "balanced",
    label: "Balanced",
    icon: "scale-balanced",
    tagline: "Fast server · security filtering · leak protection",
    protocolLabel: "WireGuard · Balanced",
    hops: 1,
    latencyPenalty: 4,
  },
  {
    key: "privacy",
    label: "Max Privacy",
    icon: "user-secret",
    tagline: "Multi-hop · strict DNS · maximum privacy",
    protocolLabel: "WireGuard · Multi-hop",
    hops: 2,
    latencyPenalty: 22,
  },
];

export interface SplitTunnelApp {
  id: string;
  name: string;
  icon: IconName;
}

export const splitTunnelApps: SplitTunnelApp[] = [
  { id: "chrome", name: "Chrome", icon: "globe" },
  { id: "whatsapp", name: "WhatsApp", icon: "comment" },
  { id: "mt5", name: "MT5 Trading", icon: "chart-line" },
  { id: "youtube", name: "YouTube", icon: "video" },
  { id: "printer", name: "Local Printer", icon: "print" },
  { id: "banking", name: "Banking App", icon: "building-columns" },
];

export interface ThreatCategory {
  key: "ads" | "trackers" | "malware" | "phishing";
  label: string;
  icon: IconName;
  color: string;
}

export const threatCategories: ThreatCategory[] = [
  { key: "ads", label: "Ads", icon: "rectangle-ad", color: "#FF9300" },
  { key: "trackers", label: "Trackers", icon: "satellite-dish", color: "#000F9A" },
  { key: "malware", label: "Malware", icon: "bug", color: "#EF4444" },
  { key: "phishing", label: "Phishing", icon: "user-secret", color: "#A855F7" },
];

export const initialThreatCounts: Record<ThreatCategory["key"], number> = {
  ads: 812,
  trackers: 341,
  malware: 12,
  phishing: 6,
};

export const threatDomainPool: Record<ThreatCategory["key"], string[]> = {
  ads: ["ads.doubleclick.net", "pagead2.googlesyndication.com", "adservice.google.com", "adnxs.com"],
  trackers: ["scorecardresearch.com", "segment.io", "mixpanel.com", "hotjar.com", "branch.io"],
  malware: ["xkcdupdate.info", "freegift-claim.ru", "setup-installer.top"],
  phishing: ["secure-login-verify.com", "account-update-alert.net", "signin-support.help"],
};

export interface TrustedNetwork {
  id: number;
  name: string;
}

export const initialTrustedNetworks: TrustedNetwork[] = [
  { id: 1, name: "Home Wi-Fi" },
  { id: 2, name: "Office Wi-Fi" },
];

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "",
    features: ["1 device", "3 server locations", "10 GB / month", "Standard support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9.99",
    period: "/month",
    features: [
      "5 devices",
      "All server locations",
      "Unlimited data",
      "Threat Blocker",
      "Multi-Hop routing",
      "Priority support",
    ],
  },
  {
    id: "family",
    name: "Family",
    price: "$16.99",
    period: "/month",
    features: [
      "10 devices",
      "All server locations",
      "Unlimited data",
      "Threat Blocker",
      "Multi-Hop routing",
      "Family sharing (up to 6 accounts)",
      "Priority support",
    ],
  },
];

export interface Device {
  id: number;
  name: string;
  platform: string;
  lastActive: string;
  current: boolean;
}

export const devices: Device[] = [
  { id: 1, name: "iPhone 15 Pro", platform: "iOS", lastActive: "Active now", current: true },
  { id: 2, name: "MacBook Pro", platform: "macOS", lastActive: "Active 2h ago", current: false },
  { id: 3, name: "Home PC", platform: "Windows", lastActive: "Active yesterday", current: false },
];

export interface TrustedService {
  id: string;
  name: string;
  domain: string;
  includeSubdomains: boolean;
  enabled: boolean;
  builtIn: boolean;
}

export const initialTrustedServices: TrustedService[] = [
  {
    id: "royal-forex-ai",
    name: "Royal Forex AI",
    domain: "forex-ai.up.railway.app",
    includeSubdomains: false,
    enabled: true,
    builtIn: true,
  },
  {
    id: "exness",
    name: "Exness",
    domain: "exness.com",
    includeSubdomains: true,
    enabled: true,
    builtIn: true,
  },
];

export interface TabDef {
  key: string;
  icon: IconName;
  label: string;
}

export const tabsDef: TabDef[] = [
  { key: "home", icon: "house", label: "Home" },
  { key: "servers", icon: "server", label: "Servers" },
  { key: "security", icon: "shield-halved", label: "Security" },
  { key: "devices", icon: "mobile-screen-button", label: "Devices" },
  { key: "settings", icon: "gear", label: "Settings" },
];

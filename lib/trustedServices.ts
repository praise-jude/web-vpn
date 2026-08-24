import type { TrustedService } from "./data";

const HOSTNAME_RE = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i;

export function normalizeDomain(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
}

export function isValidDomain(input: string) {
  return HOSTNAME_RE.test(input);
}

export function matchesDomain(hostname: string, service: TrustedService) {
  const host = hostname.toLowerCase();
  const domain = service.domain.toLowerCase();
  if (host === domain) return true;
  return service.includeSubdomains && host.endsWith(`.${domain}`);
}

const KNOWN_BRANDS = ["royal-vpn", "royalvpn"];

/** Soft heuristic only — flags a domain that name-drops a trusted brand without matching its real domain. Never blocks the add, just warns. */
export function lookalikeWarning(domain: string, existing: TrustedService[]): string | null {
  const alreadyTrusted = existing.some((s) => matchesDomain(domain, s) || domain.endsWith(`.${s.domain}`) || s.domain.endsWith(`.${domain}`));
  if (alreadyTrusted) return null;

  const brand = KNOWN_BRANDS.find((b) => domain.includes(b));
  if (!brand) return null;

  return `"${domain}" mentions "${brand}" but isn't the official domain. Double-check this is really who you think it is before trusting it.`;
}

export interface ReachabilityResult {
  ok: boolean;
  latencyMs: number | null;
  checkedAt: number;
}

export async function checkReachability(domain: string, timeoutMs = 6000): Promise<ReachabilityResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = performance.now();

  try {
    await fetch(`https://${domain}/`, {
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });
    return { ok: true, latencyMs: Math.round(performance.now() - started), checkedAt: Date.now() };
  } catch {
    return { ok: false, latencyMs: null, checkedAt: Date.now() };
  } finally {
    clearTimeout(timer);
  }
}

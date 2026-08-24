const CREDENTIAL_ID_KEY = "royal-vpn:app-lock-credential-id";

function bufferToBase64url(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBuffer(b64url: string) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const str = atob(b64 + pad);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes.buffer;
}

export async function isBiometricSupported() {
  if (typeof window === "undefined") return false;
  if (!window.PublicKeyCredential) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export function hasStoredCredential() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(CREDENTIAL_ID_KEY);
}

export async function registerBiometricCredential() {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const userId = crypto.getRandomValues(new Uint8Array(16));

  const credential = (await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: "Royal-VPN" },
      user: { id: userId, name: "royal-vpn-user", displayName: "Royal-VPN User" },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
      timeout: 60000,
      attestation: "none",
    },
  })) as PublicKeyCredential | null;

  if (!credential) throw new Error("Registration failed");
  localStorage.setItem(CREDENTIAL_ID_KEY, bufferToBase64url(credential.rawId));
  return true;
}

export async function verifyBiometric() {
  const storedId = localStorage.getItem(CREDENTIAL_ID_KEY);
  if (!storedId) {
    await registerBiometricCredential();
    return true;
  }

  const challenge = crypto.getRandomValues(new Uint8Array(32));
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [{ id: base64urlToBuffer(storedId), type: "public-key", transports: ["internal"] }],
      userVerification: "required",
      timeout: 60000,
    },
  });

  return !!assertion;
}

export function clearBiometricCredential() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CREDENTIAL_ID_KEY);
}

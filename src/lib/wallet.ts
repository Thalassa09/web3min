/**
 * Pure TypeScript EIP-55 EVM address validator and formatter.
 * Zero external libraries, zero node:crypto dependencies.
 */

// Keccak-f[1600] constants
const RC = [
  0x0000000000000001n, 0x0000000000008082n, 0x800000000000808an, 0x8000000080008000n,
  0x000000000000808bn, 0x0000000080000001n, 0x8000000080008081n, 0x8000000000008009n,
  0x000000000000008an, 0x0000000000000088n, 0x0000000080008009n, 0x000000008000000an,
  0x000000008000808bn, 0x800000000000008bn, 0x8000000000008089n, 0x8000000000008003n,
  0x8000000000008002n, 0x8000000000000080n, 0x000000000000800an, 0x800000008000000an,
  0x8000000080008081n, 0x8000000000008080n, 0x0000000080000001n, 0x8000000080008008n,
];

const RHO = [
  0,  1, 62, 28, 27,
 36, 44,  6, 55, 20,
  3, 10, 43, 25, 39,
 41, 45, 15, 21,  8,
 18,  2, 61, 56, 14,
];

const PI = [
  0, 10, 20,  5, 15,
 16,  1, 11, 21,  6,
  7, 17,  2, 12, 22,
 23,  8, 18,  3, 13,
 14, 24,  9, 19,  4,
];

function rotl64(x: bigint, n: number): bigint {
  const bn = BigInt(n);
  return ((x << bn) | (x >> (64n - bn))) & 0xFFFFFFFFFFFFFFFFn;
}

export function keccak256String(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const rate = 136;
  const paddingLen = rate - (bytes.length % rate);
  const padded = new Uint8Array(bytes.length + paddingLen);
  padded.set(bytes);
  padded[bytes.length] = 0x01;
  padded[padded.length - 1] |= 0x80;

  const state = new BigUint64Array(25);
  for (let b = 0; b < padded.length; b += rate) {
    for (let i = 0; i < rate / 8; i++) {
      const idx = b + i * 8;
      const val =
        BigInt(padded[idx]) |
        (BigInt(padded[idx + 1]) << 8n) |
        (BigInt(padded[idx + 2]) << 16n) |
        (BigInt(padded[idx + 3]) << 24n) |
        (BigInt(padded[idx + 4]) << 32n) |
        (BigInt(padded[idx + 5]) << 40n) |
        (BigInt(padded[idx + 6]) << 48n) |
        (BigInt(padded[idx + 7]) << 56n);
      state[i] ^= val;
    }
    for (let round = 0; round < 24; round++) {
      const C = new BigUint64Array(5);
      for (let x = 0; x < 5; x++) {
        C[x] = state[x] ^ state[x + 5] ^ state[x + 10] ^ state[x + 15] ^ state[x + 20];
      }
      const D = new BigUint64Array(5);
      for (let x = 0; x < 5; x++) {
        D[x] = C[(x + 4) % 5] ^ rotl64(C[(x + 1) % 5], 1);
      }
      for (let i = 0; i < 25; i++) {
        state[i] ^= D[i % 5];
      }
      const B = new BigUint64Array(25);
      for (let i = 0; i < 25; i++) {
        B[PI[i]] = rotl64(state[i], RHO[i]);
      }
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          state[x + y * 5] = B[x + y * 5] ^ ((~B[((x + 1) % 5) + y * 5]) & B[((x + 2) % 5) + y * 5]);
        }
      }
      state[0] ^= RC[round];
    }
  }

  let hex = "";
  for (let i = 0; i < 4; i++) {
    let v = state[i];
    for (let j = 0; j < 8; j++) {
      hex += Number(v & 0xFFn).toString(16).padStart(2, "0");
      v >>= 8n;
    }
  }
  return hex;
}

/**
 * Validates EVM address:
 * 1. Matches 0x followed by 40 hex characters.
 * 2. If all lowercase or all uppercase, valid.
 * 3. If mixed case, strictly validates EIP-55 checksum.
 */
export function isValidEvmAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;
  const trimmed = address.trim();
  if (!/^0x[0-9a-fA-F]{40}$/.test(trimmed)) return false;

  // All lowercase or all uppercase is syntactically valid in EVM standard
  if (/^0x[0-9a-f]{40}$/.test(trimmed) || /^0x[0-9A-F]{40}$/.test(trimmed)) {
    return true;
  }

  // Mixed case: check EIP-55
  try {
    const raw = trimmed.slice(2);
    const hash = keccak256String(raw.toLowerCase());
    for (let i = 0; i < 40; i++) {
      const char = raw[i];
      const hashNibble = parseInt(hash[i], 16);
      if (hashNibble >= 8) {
        if (char !== char.toUpperCase()) return false;
      } else {
        if (char !== char.toLowerCase()) return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Masks an EVM wallet address for public privacy: 0x12ab…9f3c
 */
export function maskWalletAddress(address: string): string {
  if (!address || typeof address !== "string") return "-";
  const clean = address.trim();
  if (clean.length < 12) return clean;
  return `${clean.slice(0, 6)}…${clean.slice(-4)}`;
}

/**
 * Validates X/Twitter handle: 1-15 characters [A-Za-z0-9_]
 */
export function isValidXHandle(handle: string): boolean {
  if (!handle || typeof handle !== "string") return false;
  const clean = handle.trim().replace(/^@+/, "");
  return /^[a-zA-Z0-9_]{1,15}$/.test(clean);
}

/**
 * Normalizes X handle to have a single leading @
 */
export function formatXHandle(handle: string): string {
  if (!handle || typeof handle !== "string") return "";
  const clean = handle.trim().replace(/^@+/, "");
  return clean ? `@${clean}` : "";
}

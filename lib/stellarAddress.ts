/**
 * Validates a Stellar "G..." (ed25519 public key) StrKey address by fully
 * decoding it -- version byte, base32 payload, and CRC16-XModem checksum --
 * rather than just checking the prefix and length. A format-only check
 * would accept an address with transposed or mistyped characters that
 * merely "looks" right; on a payout form that means real funds sent to a
 * destination that does not exist. Reject at this boundary, before the
 * value ever reaches a submit handler.
 */

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const ED25519_PUBLIC_KEY_VERSION_BYTE = 6 << 3; // 48, per the StrKey spec

function base32Decode(input: string): Uint8Array | null {
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const char of input) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) return null;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >> bits) & 0xff);
    }
  }
  return new Uint8Array(bytes);
}

/** CRC16-XModem over `bytes`, matching the checksum algorithm StrKey uses. */
function crc16XModem(bytes: Uint8Array): number {
  let crc = 0;
  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc;
}

/** Returns `true` only for a well-formed, checksum-valid Stellar ed25519
 * public key ("G..." address). */
export function isValidStellarAddress(address: string): boolean {
  if (address.length !== 56 || address[0] !== "G") return false;

  const decoded = base32Decode(address);
  if (!decoded || decoded.length !== 35) return false;

  const [versionByte] = decoded;
  if (versionByte !== ED25519_PUBLIC_KEY_VERSION_BYTE) return false;

  const payload = decoded.subarray(0, 33);
  const expectedChecksum = decoded[33] | (decoded[34] << 8);
  return crc16XModem(payload) === expectedChecksum;
}

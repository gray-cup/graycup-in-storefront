/** Indian PIN codes are exactly 6 digits, first digit 1-9. */
export const INDIA_PINCODE_RE = /^[1-9]\d{5}$/;

export function isValidIndiaPincode(value: string | null | undefined): boolean {
  return INDIA_PINCODE_RE.test((value ?? "").trim());
}

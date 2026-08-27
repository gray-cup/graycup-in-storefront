// Module-level handle so WebMCP tool `execute` callbacks can read/mutate the
// cart without closing over React state (use-webmcp-tool does not re-register
// when `execute` changes). CartProvider keeps `current` pointed at the live
// context value; the nav function is set by <WebMCPTools/>.
import type { useCart } from "@/components/cart-provider";
import type { NavigateFunction } from "react-router";

export const cartBridge: { current: ReturnType<typeof useCart> | null } = {
  current: null,
};

export const navBridge: { current: NavigateFunction | null } = { current: null };

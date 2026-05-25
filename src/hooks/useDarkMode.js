// ── Hook helper: kembalikan object CSS class berdasarkan state.darkMode ──
// Gunakan di setiap halaman: const dk = useDarkMode();
// Lalu pakai: className={dk.page}, dk.card, dll.

import { useApp } from "../context/AppContext";

export function useDarkMode() {
  const { state } = useApp();
  const d = state.darkMode;

  return {
    // Wrapper halaman
    page: d
      ? "bg-neutral-900 text-neutral-100"
      : "bg-neutral-50 text-neutral-900",
    pageSolid: d ? "bg-neutral-900" : "bg-white",

    // Card / surface
    card: d
      ? "bg-neutral-800 border-neutral-700"
      : "bg-white border-neutral-100",
    cardInner: d
      ? "bg-neutral-700 border-neutral-600"
      : "bg-neutral-50 border-neutral-200",

    // Teks
    textPrimary: d ? "text-neutral-100" : "text-neutral-800",
    textSecondary: d ? "text-neutral-400" : "text-neutral-500",
    textMuted: d ? "text-neutral-500" : "text-neutral-400",
    textHint: d ? "text-neutral-600" : "text-neutral-300",

    // Input
    input: d
      ? "bg-neutral-700 border-neutral-600 text-neutral-100 placeholder-neutral-500"
      : "bg-neutral-50  border-neutral-200 text-neutral-800 placeholder-neutral-300",

    // Divider
    divider: d ? "bg-neutral-700" : "bg-neutral-100",

    // Nav bar
    nav: d
      ? "bg-neutral-900/95 border-neutral-800"
      : "bg-white/90 border-neutral-100",
    navActive: d ? "text-primary-400" : "text-primary-600",
    navInactive: d ? "text-neutral-600" : "text-neutral-400",

    // Badge / chip
    badge: d
      ? "bg-primary-900/40 text-primary-300"
      : "bg-primary-50 text-primary-600",
    chipActive: d ? "bg-primary-600 text-white" : "bg-primary-600 text-white",
    chipIdle: d
      ? "bg-neutral-700 text-neutral-300 border-neutral-600"
      : "bg-white text-neutral-600 border-neutral-200",

    // Toggle background
    toggleOn: d ? "bg-primary-500" : "bg-neutral-800",
    toggleOff: d ? "bg-neutral-600" : "bg-neutral-300",

    // Section icon bg
    iconBg: d ? "bg-primary-900/30" : "bg-primary-50",

    // Raw boolean — untuk kondisi khusus
    isDark: d,
  };
}

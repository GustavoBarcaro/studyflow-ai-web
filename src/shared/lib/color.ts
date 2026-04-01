export const TOPIC_COLOR_PRESETS = [
  "#0ea5e9",
  "#f97316",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#f59e0b",
  "#14b8a6",
  "#ec4899",
] as const;

export function normalizeHexColor(value: string) {
  const trimmed = value.trim();
  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  const expanded =
    prefixed.length === 4
      ? `#${prefixed[1]}${prefixed[1]}${prefixed[2]}${prefixed[2]}${prefixed[3]}${prefixed[3]}`
      : prefixed;

  return expanded.toUpperCase();
}

export function isValidHexColor(value: string) {
  return /^#([0-9A-F]{6})$/i.test(normalizeHexColor(value));
}

export function withAlpha(hex: string, alpha: number) {
  const normalized = normalizeHexColor(hex);

  if (!isValidHexColor(normalized)) {
    return `rgba(148, 163, 184, ${alpha})`;
  }

  const r = Number.parseInt(normalized.slice(1, 3), 16);
  const g = Number.parseInt(normalized.slice(3, 5), 16);
  const b = Number.parseInt(normalized.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

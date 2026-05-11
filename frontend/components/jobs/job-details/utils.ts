import type { OutputFile } from "@/lib/types/jobs";

export function isTouchMobileDevice(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const hasTouch =
    navigator.maxTouchPoints > 0 ||
    "ontouchstart" in window ||
    (window.matchMedia?.("(pointer: coarse)").matches ?? false);

  const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  return hasTouch && mobileUa;
}

export function pickSplatUrl(
  files: OutputFile[],
  selectedFileName?: string,
): string | null {
  if (selectedFileName) {
    const selected = files.find((x) => x.file_name === selectedFileName);
    if (selected) {
      return selected.url;
    }
  }

  const sog = files.find((x) => x.file_name.toLowerCase().endsWith(".sog"));
  return sog?.url ?? files[0]?.url ?? null;
}

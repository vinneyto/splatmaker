"use client";

import { useMemo } from "react";

export function usePublicSplatUrl(filename: string): string {
  return useMemo(() => {
    const normalized = filename.trim().replace(/^\/+/, "");
    return `/${normalized}`;
  }, [filename]);
}

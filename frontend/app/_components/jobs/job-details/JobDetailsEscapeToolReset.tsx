"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/_store/hooks";
import { setActiveTool } from "@/app/_store/toolsSlice";

export function JobDetailsEscapeToolReset() {
  const dispatch = useAppDispatch();
  const activeTool = useAppSelector((state) => state.tools.activeTool);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !activeTool) {
        return;
      }

      dispatch(setActiveTool(null));
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeTool, dispatch]);

  return null;
}

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ClippingPlacement } from "@/app/_lib/types/clipping";

export type ActiveTool = "clipping" | null;

type ToolsState = {
  activeTool: ActiveTool;
  clippingPlacement: ClippingPlacement | null;
  clippingDraftPlacement: ClippingPlacement | null;
};

const initialState: ToolsState = {
  activeTool: null,
  clippingPlacement: null,
  clippingDraftPlacement: null,
};

const toolsSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {
    setActiveTool(state, action: PayloadAction<ActiveTool>) {
      state.activeTool = action.payload;

      if (action.payload === "clipping") {
        state.clippingDraftPlacement = state.clippingPlacement
          ? { ...state.clippingPlacement }
          : null;
        return;
      }

      state.clippingDraftPlacement = null;
    },
    toggleTool(state, action: PayloadAction<Exclude<ActiveTool, null>>) {
      state.activeTool =
        state.activeTool === action.payload ? null : action.payload;

      if (state.activeTool === "clipping") {
        state.clippingDraftPlacement = state.clippingPlacement
          ? { ...state.clippingPlacement }
          : null;
        return;
      }

      state.clippingDraftPlacement = null;
    },
    setClippingDraftPlacement(
      state,
      action: PayloadAction<ClippingPlacement | null>,
    ) {
      state.clippingDraftPlacement = action.payload;
    },
    applyClippingDraftPlacement(state) {
      state.clippingPlacement = state.clippingDraftPlacement
        ? { ...state.clippingDraftPlacement }
        : null;
      state.clippingDraftPlacement = null;
      state.activeTool = null;
    },
    updateCylinderClippingDraftDimensions(
      state,
      action: PayloadAction<{ radius: number; height: number }>,
    ) {
      if (
        !state.clippingDraftPlacement ||
        state.clippingDraftPlacement.type !== "cylinder"
      ) {
        return;
      }

      state.clippingDraftPlacement.radius = action.payload.radius;
      state.clippingDraftPlacement.height = action.payload.height;
    },
  },
});

export const {
  setActiveTool,
  toggleTool,
  setClippingDraftPlacement,
  applyClippingDraftPlacement,
  updateCylinderClippingDraftDimensions,
} = toolsSlice.actions;
export const toolsReducer = toolsSlice.reducer;

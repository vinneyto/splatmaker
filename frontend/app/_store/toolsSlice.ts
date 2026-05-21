import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ClippingPlacement } from "@/app/_lib/types/clipping";

export type ActiveTool = "clipping" | null;

type ToolsState = {
  activeTool: ActiveTool;
  clippingPlacement: ClippingPlacement | null;
};

const initialState: ToolsState = {
  activeTool: null,
  clippingPlacement: null,
};

const toolsSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {
    setActiveTool(state, action: PayloadAction<ActiveTool>) {
      state.activeTool = action.payload;
      if (!action.payload) {
        state.clippingPlacement = null;
      }
    },
    toggleTool(state, action: PayloadAction<Exclude<ActiveTool, null>>) {
      state.activeTool = state.activeTool === action.payload ? null : action.payload;
      if (!state.activeTool) {
        state.clippingPlacement = null;
      }
    },
    setClippingPlacement(state, action: PayloadAction<ClippingPlacement | null>) {
      state.clippingPlacement = action.payload;
    },
    updateCylinderClippingDimensions(
      state,
      action: PayloadAction<{ radius: number; height: number }>,
    ) {
      if (!state.clippingPlacement || state.clippingPlacement.type !== "cylinder") {
        return;
      }

      state.clippingPlacement.radius = action.payload.radius;
      state.clippingPlacement.height = action.payload.height;
    },
  },
});

export const {
  setActiveTool,
  toggleTool,
  setClippingPlacement,
  updateCylinderClippingDimensions,
} = toolsSlice.actions;
export const toolsReducer = toolsSlice.reducer;

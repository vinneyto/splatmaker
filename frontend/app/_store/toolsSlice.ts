import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ActiveTool = "clipping" | null;

type ToolsState = {
  activeTool: ActiveTool;
};

const initialState: ToolsState = {
  activeTool: null,
};

const toolsSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {
    setActiveTool(state, action: PayloadAction<ActiveTool>) {
      state.activeTool = action.payload;
    },
    toggleTool(state, action: PayloadAction<Exclude<ActiveTool, null>>) {
      state.activeTool = state.activeTool === action.payload ? null : action.payload;
    },
  },
});

export const { setActiveTool, toggleTool } = toolsSlice.actions;
export const toolsReducer = toolsSlice.reducer;

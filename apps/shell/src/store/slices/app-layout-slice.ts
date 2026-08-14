import { createSlice } from "@reduxjs/toolkit";

type AppLayoutState = {
  runningExperimentId: string | null;
  windowMaximized: boolean;
};

const initialState: AppLayoutState = {
  runningExperimentId: null,
  windowMaximized: false
};

const appLayoutSlice = createSlice({
  name: "appLayout",
  initialState,
  reducers: {
    closeWindow(state) {
      state.runningExperimentId = null;
      state.windowMaximized = false;
    },
    minimizeWindow(state, action: { payload: string }) {
      state.runningExperimentId = action.payload;
      state.windowMaximized = false;
    },
    openWindow(state, action: { payload: string }) {
      state.runningExperimentId = action.payload;
    },
    toggleWindowMaximized(state) {
      state.windowMaximized = !state.windowMaximized;
    }
  }
});

export const { closeWindow, minimizeWindow, openWindow, toggleWindowMaximized } =
  appLayoutSlice.actions;
export const appLayoutReducer = appLayoutSlice.reducer;

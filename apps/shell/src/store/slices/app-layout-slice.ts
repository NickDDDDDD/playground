import { createSlice } from "@reduxjs/toolkit";

type AppLayoutState = {
  runningExperimentId: string | null;
  sleeping: boolean;
  windowMaximized: boolean;
};

const initialState: AppLayoutState = {
  runningExperimentId: null,
  sleeping: false,
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
    sleepPlayground(state) {
      state.sleeping = true;
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
    },
    wakePlayground(state) {
      state.sleeping = false;
    }
  }
});

export const {
  closeWindow,
  minimizeWindow,
  openWindow,
  sleepPlayground,
  toggleWindowMaximized,
  wakePlayground
} = appLayoutSlice.actions;
export const appLayoutReducer = appLayoutSlice.reducer;

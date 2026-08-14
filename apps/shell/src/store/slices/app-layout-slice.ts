import { createSlice } from "@reduxjs/toolkit";

type AppLayoutState = {
  windowMaximized: boolean;
  windowMinimized: boolean;
};

const initialState: AppLayoutState = {
  windowMaximized: false,
  windowMinimized: false
};

const appLayoutSlice = createSlice({
  name: "appLayout",
  initialState,
  reducers: {
    closeWindow(state) {
      state.windowMaximized = false;
      state.windowMinimized = false;
    },
    minimizeWindow(state) {
      state.windowMinimized = true;
    },
    restoreWindow(state) {
      state.windowMinimized = false;
    },
    toggleWindowMaximized(state) {
      state.windowMaximized = !state.windowMaximized;
      state.windowMinimized = false;
    }
  }
});

export const { closeWindow, minimizeWindow, restoreWindow, toggleWindowMaximized } =
  appLayoutSlice.actions;
export const appLayoutReducer = appLayoutSlice.reducer;

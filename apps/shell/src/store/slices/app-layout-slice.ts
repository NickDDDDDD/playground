import { createSlice } from "@reduxjs/toolkit";

type AppLayoutState = {
  dockCollapsed: boolean;
};

const initialState: AppLayoutState = {
  dockCollapsed: false
};

const appLayoutSlice = createSlice({
  name: "appLayout",
  initialState,
  reducers: {
    toggleDock(state) {
      state.dockCollapsed = !state.dockCollapsed;
    }
  }
});

export const { toggleDock } = appLayoutSlice.actions;
export const appLayoutReducer = appLayoutSlice.reducer;

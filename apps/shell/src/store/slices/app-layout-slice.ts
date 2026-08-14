import { createSlice } from "@reduxjs/toolkit";

type AppLayoutState = {
  sidebarCollapsed: boolean;
};

const initialState: AppLayoutState = {
  sidebarCollapsed: false
};

const appLayoutSlice = createSlice({
  name: "appLayout",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    }
  }
});

export const { toggleSidebar } = appLayoutSlice.actions;
export const appLayoutReducer = appLayoutSlice.reducer;

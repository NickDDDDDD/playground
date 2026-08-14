import { configureStore, createSlice } from "@reduxjs/toolkit";

const standaloneSlice = createSlice({
  name: "welcomeStandalone",
  initialState: {
    bootCount: 1
  },
  reducers: {}
});

export const standaloneStore = configureStore({
  reducer: {
    welcomeStandalone: standaloneSlice.reducer
  }
});

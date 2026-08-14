import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { appLayoutReducer } from "./slices/app-layout-slice";
import { playgroundApi } from "./services/playground-api";

export const store = configureStore({
  reducer: {
    appLayout: appLayoutReducer,
    [playgroundApi.reducerPath]: playgroundApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(playgroundApi.middleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";

import { jobsApi } from "@/app/_lib/jobsApi";
import { toolsReducer } from "@/app/_lib/toolsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [jobsApi.reducerPath]: jobsApi.reducer,
      tools: toolsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(jobsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

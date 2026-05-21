import { configureStore } from "@reduxjs/toolkit";

import { jobsApi } from "@/app/_libs/jobsApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      [jobsApi.reducerPath]: jobsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(jobsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

"use client";

import { ReactNode, useState } from "react";
import { Provider } from "react-redux";

import { makeStore } from "@/app/_libs/store";

export function Providers({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { AppRouter } from "@/router";
import { Providers } from "@/components/Providers";
import "@/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Providers>
  </StrictMode>,
);

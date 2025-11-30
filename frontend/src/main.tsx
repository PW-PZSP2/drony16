import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode, Suspense } from "react";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { buildRouter } from "./router";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const router = buildRouter();

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
);

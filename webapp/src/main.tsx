import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./router";
import { useManifest } from "@hooks/useManifest";
import { RouterProvider } from "@tanstack/react-router";
import "./main.css";
import "../build.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

function App() {
  const items = useManifest();
  /** Don't actually render the router till context is ready and the manifest is resolved. */
  return (
    items.length > 0 && <RouterProvider router={router} context={{ items }} />
  );
}

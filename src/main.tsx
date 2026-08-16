import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AdminApp from "./Admin";
import "./index.css";

const path = window.location.pathname.replace(/\/+$/, "");
const isAdminRoute = path.endsWith("/admin");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isAdminRoute ? <AdminApp /> : <App />}
  </StrictMode>,
);

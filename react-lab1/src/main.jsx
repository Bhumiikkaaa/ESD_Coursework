// The entry point. index.html loads this file; it finds <div id="root"> and hands it to
// React, which draws <App /> inside it. Given — you don't need to change it.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

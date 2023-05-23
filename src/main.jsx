import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("content")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
  // <HashRouter>
  //   <App />
  // </HashRouter>
);

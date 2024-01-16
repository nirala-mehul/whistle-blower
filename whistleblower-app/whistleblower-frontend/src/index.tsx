import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

window.Buffer = require("buffer/index").Buffer;

async function renderApp() {
  const { default: App } = await import("./App");
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

renderApp();

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { pet } from "./utils/fetch";

declare global {
  interface Window {
    pet: {
      get: (url: string) => Promise<unknown>;
      post: (url: string, body: unknown) => Promise<unknown>;
      put: (url: string, body: unknown) => Promise<unknown>;
      deletee: (url: string) => Promise<unknown>;
    };
  }
}

pet();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

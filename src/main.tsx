import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './tailwind.css'
import.meta.env.MODE === "production" && Sentry.init({
  dsn: "https://66b0e1921ac6417083c93c0c4d77c3d1@sentry.nod.run/6",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);

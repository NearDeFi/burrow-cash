import dotenv from "dotenv";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { init, ErrorBoundary } from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import posthogJs, { SentryIntegration } from "posthog-js";

import App from "./App";
import { FallbackError, Modal } from "./components";
import theme from "./theme";
import { store, persistor } from "./redux/store";
import { posthog, isPostHogEnabled } from "./telemetry";
import "./global.css";

dotenv.config();

const SENTRY_ORG = process.env.SENTRY_ORG as string;
const SENTRY_PID = process.env.SENTRY_PID as unknown as number;

const integrations = [new Integrations.BrowserTracing()] as Array<
  Integrations.BrowserTracing | SentryIntegration
>;

if (isPostHogEnabled) {
  integrations.push(new posthogJs.SentryIntegration(posthog, SENTRY_ORG, SENTRY_PID));
}

init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.DEFAULT_NETWORK,
  integrations,
  tracesSampleRate: 1.0,
  release: "v1",
});

ReactDOM.render(
  <ErrorBoundary fallback={FallbackError}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <App />
          <Modal />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </ErrorBoundary>,

  document.querySelector("#root"),
);

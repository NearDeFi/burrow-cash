import dotenv from "dotenv";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { init, ErrorBoundary } from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from "./App";
import { FallbackError, Modal } from "./components";
import theme from "./theme";
import { store, persistor } from "./redux/store";
import { isMain } from "./store/constants";
import "./global.css";

dotenv.config();

if (isMain) {
  init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.DEFAULT_NETWORK,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

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

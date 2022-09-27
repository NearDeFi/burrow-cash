import { useEffect } from "react";
import Head from "next/head";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { PersistGate } from "redux-persist/integration/react";
import { init, ErrorBoundary } from "@sentry/react";
import { ThemeProvider } from "@mui/material/styles";
import { Integrations } from "@sentry/tracing";
import posthogJs from "posthog-js";
import { useIdle, useInterval } from "react-use";

import "../styles/global.css";
import { store, persistor } from "../redux/store";
import { FallbackError, Layout, Modal } from "../components";
import theme from "../utils/theme";
import { posthog, isPostHogEnabled } from "../utils/telemetry";
import { useAppDispatch } from "../redux/hooks";
import { fetchAssets, fetchRefPrices } from "../redux/assetsSlice";
import { fetchAccount } from "../redux/accountSlice";
import { fetchConfig } from "../redux/appSlice";

const SENTRY_ORG = process.env.NEXT_PUBLIC_SENTRY_ORG as string;
const SENTRY_PID = process.env.NEXT_PUBLIC_SENTRY_PID as unknown as number;

const integrations = [new Integrations.BrowserTracing()] as Array<
  Integrations.BrowserTracing | any
>;

if (isPostHogEnabled) {
  integrations.push(new posthogJs.SentryIntegration(posthog, SENTRY_ORG, SENTRY_PID));
}

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_DEFAULT_NETWORK,
  integrations,
  tracesSampleRate: 0.1,
  release: "v1",
});

const IDLE_INTERVAL = 30e3;
const REFETCH_INTERVAL = 60e3;

const Init = () => {
  const isIdle = useIdle(IDLE_INTERVAL);
  const dispatch = useAppDispatch();

  const fetchData = () => {
    dispatch(fetchAssets()).then(() => dispatch(fetchRefPrices()));
    dispatch(fetchAccount());
  };

  useEffect(() => {
    dispatch(fetchConfig());
  }, []);
  useEffect(fetchData, []);
  useInterval(fetchData, !isIdle ? REFETCH_INTERVAL : null);

  return null;
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary fallback={FallbackError}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <Head>
              <meta name="viewport" content="viewport-fit=cover" />
              <title>Burrow Cash</title>
            </Head>
            <Layout>
              <Init />
              <Modal />
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}

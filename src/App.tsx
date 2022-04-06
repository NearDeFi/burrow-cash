import "regenerator-runtime/runtime";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { HashRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { useIdle, useInterval } from "react-use";

import { Borrow, Portfolio, Deposit, Staking, Terms, Privacy } from "./screens";
import { Layout } from "./components";
import { useAppDispatch } from "./redux/hooks";
import { fetchAssetsAndMetadata } from "./redux/assetsSlice";
import { fetchAccount } from "./redux/accountSlice";
import { fetchConfig } from "./redux/appSlice";
import { isMain } from "./store/constants";

if (!isMain) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.DEFAULT_NETWORK,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

const IDLE_INTERVAL = 30e3;
const REFETCH_INTERVAL = 60e3;

const App = () => {
  const isIdle = useIdle(IDLE_INTERVAL);
  const dispatch = useAppDispatch();

  const fetchData = () => {
    dispatch(fetchAssetsAndMetadata());
    dispatch(fetchAccount());
  };

  useEffect(() => {
    dispatch(fetchConfig());
  }, []);
  useEffect(fetchData, []);
  useInterval(fetchData, !isIdle ? REFETCH_INTERVAL : null);

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate replace to="/deposit" />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;

import "regenerator-runtime/runtime";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { useIdle, useInterval } from "react-use";

import { Borrow, Portfolio, Deposit, Terms, Privacy } from "./screens";
import { Layout } from "./components";
import { useAppDispatch } from "./redux/hooks";
import { fetchAssets } from "./redux/assetsSlice";
import { fetchAccount } from "./redux/accountSlice";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.DEFAULT_NETWORK,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

const App = () => {
  const isIdle = useIdle(30e3);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAccount());
    dispatch(fetchAssets());
  }, []);

  useInterval(
    () => {
      dispatch(fetchAssets());
    },
    !isIdle ? 60e3 : null,
  );

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate replace to="/deposit" />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;

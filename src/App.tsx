import "regenerator-runtime/runtime";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import { Borrow, Portfolio, Supply, Terms, Privacy } from "./screens";
import { Layout } from "./components";
import {
  getAssetsDetailed,
  getBalances,
  getAllMetadata,
  // getPortfolio, getAccount
} from "./store";
import { useAppDispatch } from "./redux/hooks";
import { receivedAssets } from "./redux/assetsSlice";
import { receivedBalances } from "./redux/balancesSlice";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.DEFAULT_NETWORK,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

const App = () => {
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    const assets = await getAssetsDetailed();

    const [metadata, balances] = await Promise.all([
      getAllMetadata(assets.map((asset) => asset.token_id)),
      getBalances(assets.map((asset) => asset.token_id)),
    ]);

    dispatch(receivedAssets({ assets, metadata }));
    dispatch(receivedBalances(balances));
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate replace to="/supply" />} />
          <Route path="/supply" element={<Supply />} />
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

import { useContext } from "react";
import { Box, Typography, useTheme } from "@mui/material";

import { USD_FORMAT } from "../../store/constants";
import { ContractContext } from "../../context/contracts";
import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox } from "../../components";

import Table from "../../components/Table";
import { suppliedColumns, borrowColumns } from "./tabledata";
import { sumReducer } from "../../store";

const Portfolio = () => {
  const { assets, metadata, portfolio, balances } = useContext(ContractContext);
  const theme = useTheme();

  const totalSupplied = portfolio?.supplied
    .map(
      (supplied) =>
        Number(supplied.balance) *
        (assets.find((a) => a.token_id === supplied.token_id)?.price?.usd || 0),
    )
    .reduce(sumReducer, 0)
    .toLocaleString(undefined, USD_FORMAT);

  const totalBorrowed = portfolio?.borrowed
    .map(
      (borrowed) =>
        Number(borrowed.balance) *
        (assets.find((a) => a.token_id === borrowed.token_id)?.price?.usd || 0),
    )
    .reduce(sumReducer, 0)
    .toLocaleString(undefined, USD_FORMAT);

  const suppliedRows = assets
    .filter(
      (asset) =>
        !!portfolio?.supplied.find((s) => s.token_id === asset.token_id) ||
        !!portfolio?.collateral.find((c) => c.token_id === asset.token_id),
    )
    .map((asset) => ({
      ...asset,
      ...metadata.find((m) => m.token_id === asset.token_id),
      ...portfolio?.supplied.find((a) => a.token_id === asset.token_id),
      collateral: portfolio?.collateral.find(
        (collateral) => collateral.token_id === asset.token_id,
      ),
    }));

  const borrowRows = portfolio?.borrowed.map((borrowed) => ({
    ...assets.find((m) => m.token_id === borrowed.token_id),
    ...metadata.find((a) => a.token_id === borrowed.token_id),
    wallet: balances.find((b) => b.token_id === borrowed.token_id),
    ...borrowed,
  }));

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <InfoWrapper sx={{ gridTemplateColumns: "auto auto auto" }}>
        <InfoBox title="Total Supplied" value={totalSupplied} />
        {false && <InfoBox title="Net APR" value="0.00" />}
        <InfoBox title="Total Borrowed" value={totalBorrowed} />
      </InfoWrapper>

      <Typography sx={{ fontSize: 24, padding: "1rem", textAlign: "center" }}>
        <span style={{ color: theme.palette.primary.main }}>Supplied</span> Assets
      </Typography>

      {portfolio?.supplied.length || portfolio?.collateral.length ? (
        <Table rows={suppliedRows} columns={suppliedColumns} />
      ) : (
        <div style={{ textAlign: "center" }}>No supplied assets yet</div>
      )}

      <Typography sx={{ fontSize: 24, padding: "1rem", marginTop: "2rem", textAlign: "center" }}>
        <span style={{ color: theme.palette.primary.main }}>Borrowed</span> Assets
      </Typography>

      {portfolio?.borrowed.length ? (
        <Table rows={borrowRows} columns={borrowColumns} />
      ) : (
        <div style={{ textAlign: "center" }}>No borrowed assets yet</div>
      )}
    </Box>
  );
};

export default Portfolio;

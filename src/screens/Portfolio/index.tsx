import { Box, Typography, useTheme } from "@mui/material";

import { InfoBanner, TotalBRRR } from "../../components";
import Table from "../../components/Table";
import { suppliedColumns, borrowedColumns } from "./tabledata";
import { useAppSelector } from "../../redux/hooks";
import { getPortfolioAssets, getAccountId } from "../../redux/accountSelectors";

const Portfolio = () => {
  const theme = useTheme();
  const [suppliedRows, borrowedRows] = useAppSelector(getPortfolioAssets);
  const accountId = useAppSelector(getAccountId);

  return (
    <Box pb="2.5rem">
      <InfoBanner />
      {accountId && <TotalBRRR />}
      <Typography sx={{ fontSize: 24, padding: "1rem", textAlign: "center" }}>
        <span style={{ color: theme.palette.primary.main }}>Deposited</span> Assets
      </Typography>
      {suppliedRows.length ? (
        <Table rows={suppliedRows} columns={suppliedColumns} sortColumn="supplied" />
      ) : (
        <div style={{ textAlign: "center" }}>No deposited assets yet</div>
      )}
      <Typography sx={{ fontSize: 24, padding: "1rem", marginTop: "2rem", textAlign: "center" }}>
        <span style={{ color: theme.palette.primary.main }}>Borrowed</span> Assets
      </Typography>
      {borrowedRows.length ? (
        <Table rows={borrowedRows} columns={borrowedColumns} sortColumn="borrowed" />
      ) : (
        <div style={{ textAlign: "center" }}>No borrowed assets yet</div>
      )}
    </Box>
  );
};

export default Portfolio;

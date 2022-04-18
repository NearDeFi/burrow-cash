import { Box } from "@mui/material";

import { InfoBox, PageTitle, OnboardingBRRR, BetaInfo } from "../../components";
import Table from "../../components/Table";
import { suppliedColumns, borrowedColumns } from "./tabledata";
import { useAppSelector } from "../../redux/hooks";
import { getPortfolioAssets, getAccountId } from "../../redux/accountSelectors";

const Portfolio = () => {
  const [suppliedRows, borrowedRows] = useAppSelector(getPortfolioAssets);
  const accountId = useAppSelector(getAccountId);

  return (
    <Box pb="2.5rem" display="grid" justifyContent="center">
      <InfoBox accountId={accountId} />
      {!accountId && <OnboardingBRRR />}
      <BetaInfo />
      <PageTitle first="Deposited" second="Assets" />
      {suppliedRows.length ? (
        <Table rows={suppliedRows} columns={suppliedColumns} sortColumn="supplied" />
      ) : (
        <Box textAlign="center">No deposited assets yet</Box>
      )}
      <PageTitle first="Borrowed" second="Assets" />
      {borrowedRows.length ? (
        <Table
          rows={borrowedRows}
          columns={borrowedColumns}
          sortColumn="borrowed"
          sx={{ width: "none" }}
        />
      ) : (
        <Box textAlign="center">No borrowed assets yet</Box>
      )}
    </Box>
  );
};

export default Portfolio;

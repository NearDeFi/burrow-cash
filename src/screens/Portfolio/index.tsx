import { Box } from "@mui/material";

import { InfoBox, PageTitle, OnboardingBRRR, BetaInfo } from "../../components";
import Table from "../../components/Table";
import { suppliedColumns, borrowedColumns } from "./tabledata";
import { useAppSelector } from "../../redux/hooks";
import { getPortfolioAssets, getAccountId } from "../../redux/accountSelectors";
import { useTableSorting } from "../../hooks";

const Portfolio = () => {
  const [suppliedRows, borrowedRows] = useAppSelector(getPortfolioAssets);
  const accountId = useAppSelector(getAccountId);
  const { sorting, setSorting } = useTableSorting();

  return (
    <Box pb="2.5rem" display="grid" justifyContent="center">
      <InfoBox accountId={accountId} />
      {!accountId && <OnboardingBRRR />}
      <BetaInfo />
      <PageTitle first="Deposited" second="Assets" />
      {suppliedRows.length ? (
        <Table
          rows={suppliedRows}
          columns={suppliedColumns}
          sx={{ maxWidth: "800px", width: "none" }}
          sorting={{ name: "portfolioDeposited", ...sorting.portfolioDeposited, setSorting }}
        />
      ) : (
        <Box textAlign="center">No deposited assets yet</Box>
      )}
      <PageTitle first="Borrowed" second="Assets" />
      {borrowedRows.length ? (
        <Table
          rows={borrowedRows}
          columns={borrowedColumns}
          sx={{ maxWidth: "800px", width: "none" }}
          sorting={{ name: "portfolioBorrowed", ...sorting.portfolioBorrowed, setSorting }}
        />
      ) : (
        <Box textAlign="center">No borrowed assets yet</Box>
      )}
    </Box>
  );
};

export default Portfolio;

import { Box } from "@mui/material";

import { PageTitle, OnboardingBRRR, BetaInfo, NonFarmedAssets } from "../../components";
import Table from "../../components/Table";
import { suppliedColumns, borrowedColumns } from "./tabledata";
import { useAccountId, usePortfolioAssets } from "../../hooks/hooks";
import { useTableSorting } from "../../hooks/useTableSorting";

const Portfolio = () => {
  const [suppliedRows, borrowedRows] = usePortfolioAssets();
  const { sorting, setSorting } = useTableSorting();
  const accountId = useAccountId();

  return (
    <Box pb="2.5rem" display="grid" justifyContent="center">
      {!accountId && <OnboardingBRRR />}
      <BetaInfo />
      <NonFarmedAssets />
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

import { Box } from "@mui/material";

import { PageTitle, OnboardingBRRR, BetaInfo, NonFarmedAssets } from "../../components";
import { columns as defaultColumns } from "./tabledata";
import Table from "../../components/Table";
import { useAppDispatch } from "../../redux/hooks";
import { showModal } from "../../redux/appSlice";
import { useAccountId, useAvailableAssets } from "../../hooks/hooks";
import { useTableSorting } from "../../hooks/useTableSorting";

const Deposit = () => {
  const dispatch = useAppDispatch();
  const accountId = useAccountId();
  const rows = useAvailableAssets("supply");
  const { sorting, setSorting } = useTableSorting();

  const columns = !accountId
    ? [...defaultColumns.filter((col) => !["supplied", "deposited"].includes(col.dataKey))]
    : [...defaultColumns.filter((col) => col.dataKey !== "totalSupplyMoney")];

  const handleOnRowClick = ({ tokenId }) => {
    dispatch(showModal({ action: "Supply", tokenId, amount: 0 }));
  };

  return (
    <Box pb="2.5rem" display="grid" justifyContent="center">
      {!accountId && <OnboardingBRRR />}
      <NonFarmedAssets />
      <PageTitle first="Deposit" second="Assets" />
      <BetaInfo />
      <Table
        rows={rows}
        columns={columns}
        onRowClick={handleOnRowClick}
        sorting={{ name: "deposit", ...sorting.deposit, setSorting }}
      />
    </Box>
  );
};

export default Deposit;

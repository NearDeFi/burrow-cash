import { Box } from "@mui/material";

import { PageTitle, InfoBox, OnboardingBRRR, BetaInfo, NonFarmedAssets } from "../../components";
import Table from "../../components/Table";
import { columns as defaultColumns } from "./tabledata";
import { useAppDispatch } from "../../redux/hooks";
import { showModal } from "../../redux/appSlice";
import { useAccountId, useAvailableAssets } from "../../hooks/hooks";
import { useTableSorting } from "../../hooks/useTableSorting";

const Borrow = () => {
  const dispatch = useAppDispatch();
  const accountId = useAccountId();
  const rows = useAvailableAssets("borrow");
  const { sorting, setSorting } = useTableSorting();

  const columns = !accountId
    ? [...defaultColumns.filter((col) => col.dataKey !== "borrowed")]
    : defaultColumns;

  const handleOnRowClick = ({ tokenId }) => {
    dispatch(showModal({ action: "Borrow", tokenId, amount: 0 }));
  };

  return (
    <Box pb="2.5rem" display="grid" justifyContent="center">
      <InfoBox accountId={accountId} />
      {!accountId && <OnboardingBRRR />}
      <NonFarmedAssets />
      <PageTitle first="Borrow" second="Assets" />
      <BetaInfo />
      <Table
        rows={rows}
        columns={columns}
        onRowClick={handleOnRowClick}
        sorting={{ name: "borrow", ...sorting.borrow, setSorting }}
      />
    </Box>
  );
};

export default Borrow;

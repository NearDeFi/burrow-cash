import { Box } from "@mui/material";

import {
  getHealthFactor,
  getTotalAccountBalance,
  getAccountId,
} from "../../redux/accountSelectors";
import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, PageTitle, HealthFactorBox } from "../../components";
import Table from "../../components/Table";
import { columns as defaultColumns } from "./tabledata";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getTotalBalance, getAvailableAssets } from "../../redux/assetsSelectors";
import { showModal } from "../../redux/appSlice";
import { useLoading } from "../../hooks";

const Borrow = () => {
  const dispatch = useAppDispatch();
  const totalBorrowBalance = useAppSelector(getTotalBalance("borrowed"));
  const yourBorrowBalance = useAppSelector(getTotalAccountBalance("borrowed"));
  const accountId = useAppSelector(getAccountId);
  const healthFactor = useAppSelector(getHealthFactor);
  const rows = useAppSelector(getAvailableAssets("borrow"));
  const isLoading = useLoading();

  const columns = !accountId
    ? [...defaultColumns.filter((col) => col.dataKey !== "borrowed")]
    : defaultColumns;

  const handleOnRowClick = ({ tokenId }) => {
    dispatch(showModal({ action: "Borrow", tokenId, amount: 0 }));
  };

  return (
    <Box pb="2.5rem">
      <InfoWrapper sx={{ gridTemplateColumns: "auto auto auto" }}>
        <InfoBox title="Total Borrowed" value={isLoading ? undefined : totalBorrowBalance} />
        <InfoBox title="Your Borrow Balance" value={yourBorrowBalance} subtitle="Portfolio" />
        <HealthFactorBox value={isLoading ? null : healthFactor} />
      </InfoWrapper>
      <PageTitle first="Borrow" second="Assets" />
      <Table
        rows={Array.from(isLoading ? new Array(6) : rows)}
        columns={columns}
        onRowClick={handleOnRowClick}
      />
    </Box>
  );
};

export default Borrow;

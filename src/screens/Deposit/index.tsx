import { Box, Alert } from "@mui/material";

import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, PageTitle } from "../../components";
import { columns as defaultColumns } from "./tabledata";
import Table from "../../components/Table";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getTotalBalance, getAvailableAssets } from "../../redux/assetsSelectors";
import { getTotalAccountBalance, getAccountId, getNetAPY } from "../../redux/accountSelectors";
import { showModal } from "../../redux/appSlice";
import { useLoading } from "../../hooks";

const Deposit = () => {
  const dispatch = useAppDispatch();
  const totalSupplyBalance = useAppSelector(getTotalBalance("supplied"));
  const yourSupplyBalance = useAppSelector(getTotalAccountBalance("supplied"));
  const accountId = useAppSelector(getAccountId);
  const rows = useAppSelector(getAvailableAssets("supply"));
  const isLoading = useLoading();
  const netAPY = useAppSelector(getNetAPY);

  const columns = !accountId
    ? [...defaultColumns.filter((col) => col.dataKey !== "supplied")]
    : defaultColumns;

  const handleOnRowClick = ({ tokenId }) => {
    dispatch(showModal({ action: "Supply", tokenId, amount: 0 }));
  };

  return (
    <Box pb="2.5rem">
      <InfoWrapper sx={{ gridTemplateColumns: "auto auto auto" }}>
        <InfoBox title="Total Deposited" value={isLoading ? undefined : totalSupplyBalance} />
        <InfoBox
          title="Your Deposit Balance"
          value={isLoading ? undefined : yourSupplyBalance}
          subtitle="Portfolio"
        />
        <InfoBox title="Net APY" value={isLoading ? undefined : netAPY} />
      </InfoWrapper>
      <PageTitle first="Deposit" second="Assets" />
      <Box width={["100%", "520px"]} mx="auto" mt="-2rem" mb="2rem">
        <Alert severity="warning">
          This is an unaudited product. Please DO NOT deposit more than $500
        </Alert>
      </Box>
      <Table
        rows={Array.from(isLoading ? new Array(5) : rows)}
        columns={columns}
        onRowClick={handleOnRowClick}
      />
    </Box>
  );
};

export default Deposit;

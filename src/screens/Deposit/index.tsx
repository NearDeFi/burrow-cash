import { Box, Alert } from "@mui/material";

import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, PageTitle, TotalBRRR } from "../../components";
import { columns as defaultColumns } from "./tabledata";
import Table from "../../components/Table";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getTotalBalance, getAvailableAssets } from "../../redux/assetsSelectors";
import { getTotalAccountBalance, getAccountId, getNetAPY } from "../../redux/accountSelectors";
import { showModal } from "../../redux/appSlice";
import { isBeta } from "../../store";

const Deposit = () => {
  const dispatch = useAppDispatch();
  const totalSupplyBalance = useAppSelector(getTotalBalance("supplied"));
  const yourSupplyBalance = useAppSelector(getTotalAccountBalance("supplied"));
  const accountId = useAppSelector(getAccountId);
  const rows = useAppSelector(getAvailableAssets("supply")).sort(function (a, b) {
    return Number(b.brrrEfficiencyWithAPY) - Number(a.brrrEfficiencyWithAPY);
  });
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
        <InfoBox title="Total Deposited" value={totalSupplyBalance} />
        <InfoBox title="Your Deposit Balance" value={yourSupplyBalance} subtitle="Portfolio" />
        <InfoBox title="Net APY" value={netAPY} />
      </InfoWrapper>
      <PageTitle first="Deposit" second="Assets" />
      <Box width={["100%", "580px"]} mx="auto" mt="1rem" mb="1rem">
        {isBeta && (
          <Alert severity="warning">Withdraw your funds from the beta and move to mainnet</Alert>
        )}
      </Box>
      <TotalBRRR />
      <Table rows={rows} columns={columns} onRowClick={handleOnRowClick} />
    </Box>
  );
};

export default Deposit;

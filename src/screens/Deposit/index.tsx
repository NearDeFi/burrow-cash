import { Box } from "@mui/material";

import { PageTitle, InfoBanner, OnboardingBRRR, BetaInfo } from "../../components";
import { columns as defaultColumns } from "./tabledata";
import Table from "../../components/Table";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getAvailableAssets } from "../../redux/assetsSelectors";
import { getConfig } from "../../redux/appSelectors";
import { getAccountId } from "../../redux/accountSelectors";
import { showModal } from "../../redux/appSlice";

const Deposit = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector(getConfig);
  const accountId = useAppSelector(getAccountId);
  const rows = useAppSelector(getAvailableAssets("supply"));

  const columns = !accountId
    ? [...defaultColumns.filter((col) => col.dataKey !== "supplied")]
    : defaultColumns;

  const handleOnRowClick = ({ tokenId }) => {
    if (config.booster_token_id === tokenId) return;
    dispatch(showModal({ action: "Supply", tokenId, amount: 0 }));
  };

  return (
    <Box pb="2.5rem" display="grid" justifyContent="center">
      <InfoBanner />
      {!accountId && <OnboardingBRRR />}
      <PageTitle first="Deposit" second="Assets" />
      <BetaInfo />
      <Table rows={rows} columns={columns} onRowClick={handleOnRowClick} sortColumn="deposited" />
    </Box>
  );
};

export default Deposit;

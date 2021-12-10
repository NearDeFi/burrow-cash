import { Box } from "@mui/material";

import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, PageTitle } from "../../components";
import { columns as defaultColumns } from "./tabledata";
import Table from "../../components/Table";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getTotalBalance, getAvailableAssets } from "../../redux/assetsSlice";
import { getTotalAccountBalance, getAccountId } from "../../redux/accountSlice";
import { showModal } from "../../redux/appSlice";

const Supply = () => {
  const dispatch = useAppDispatch();
  const totalSupplyBalance = useAppSelector(getTotalBalance("supplied"));
  const yourSupplyBalance = useAppSelector(getTotalAccountBalance("supplied"));
  const accountId = useAppSelector(getAccountId);
  const rows = useAppSelector(getAvailableAssets("supply"));

  const columns = !accountId
    ? [...defaultColumns.filter((col) => col.dataKey !== "supplied")]
    : defaultColumns;

  const handleOnRowClick = ({ tokenId }) => {
    dispatch(showModal({ action: "Supply", tokenId, amount: 0 }));
  };

  return (
    <Box pb="2.5rem">
      <InfoWrapper>
        {rows.length > 0 && <InfoBox title="Total Supply" value={totalSupplyBalance} />}
        {accountId && (
          <InfoBox title="Your Supply Balance" value={yourSupplyBalance} subtitle="Portfolio" />
        )}
      </InfoWrapper>
      <PageTitle first="Supply" second="Assets" />
      <Table rows={rows} columns={columns} onRowClick={handleOnRowClick} />
    </Box>
  );
};

export default Supply;

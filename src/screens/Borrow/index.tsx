import { useContext } from "react";
import { Box } from "@mui/material";

import { ContractContext } from "../../context/contracts";
import { computeHealthFactor } from "../../store";
import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, PageTitle } from "../../components";
import Table from "../../components/Table";
import { columns as defaultColumns } from "./tabledata";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getTotalBalance, getAvailableAssets } from "../../redux/assetsSlice";
import { getTotalAccountBalance, getAccountId } from "../../redux/accountSlice";
import { showModal } from "../../redux/appSlice";

const Borrow = () => {
  const { assets, portfolio } = useContext(ContractContext);
  const dispatch = useAppDispatch();

  const totalBorrowBalance = useAppSelector(getTotalBalance("borrowed"));
  const yourBorrowBalance = useAppSelector(getTotalAccountBalance("borrowed"));
  const accountId = useAppSelector(getAccountId);
  const rows = useAppSelector(getAvailableAssets("borrow"));

  const columns = !accountId
    ? [...defaultColumns.filter((col) => col.dataKey !== "borrowed")]
    : defaultColumns;

  const handleOnRowClick = ({ tokenId }) => {
    dispatch(showModal({ action: "Borrow", tokenId }));
  };

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <InfoWrapper sx={{ gridTemplateColumns: "auto auto auto" }}>
        {accountId && (
          <InfoBox title="Your Borrow Balance" value={yourBorrowBalance} subtitle="Portfolio" />
        )}
        {false && <InfoBox title="Borrow Limit" value="0%" />}
        {accountId && !!portfolio && (
          <InfoBox
            title="Health Factor"
            value={`${computeHealthFactor(assets, portfolio!).toFixed(2)}%`}
          />
        )}
      </InfoWrapper>
      <PageTitle first="Borrow" second="Assets" />
      <Table rows={rows} columns={columns} onRowClick={handleOnRowClick} />
      <InfoWrapper>
        <InfoBox title="Total Borrow" value={totalBorrowBalance} />
      </InfoWrapper>
    </Box>
  );
};

export default Borrow;

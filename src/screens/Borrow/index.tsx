import { useContext } from "react";
import { Box } from "@mui/material";

import { USD_FORMAT, PERCENT_DIGITS } from "../../store/constants";
import { ContractContext } from "../../context/contracts";
import { toUsd, getAvailableAmount, computeHealthFactor, getMaxBorrowAmount } from "../../store";

import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, PageTitle } from "../../components";
import Table from "../../components/Table";
import { ModalContext, ModalState } from "../../components/Modal";
import { columns as defaultColumns } from "./tabledata";

import { useAppSelector } from "../../redux/hooks";
import { getTotalBalance, getAvailableAssets } from "../../redux/assetsSlice";
import { getTotalAccountBalance, getAccountId } from "../../redux/accountSlice";

const Borrow = () => {
  const { assets, portfolio } = useContext(ContractContext);
  const modal: ModalState = useContext(ModalContext);

  const totalBorrowBalance = useAppSelector(getTotalBalance("borrowed"));
  const yourBorrowBalance = useAppSelector(getTotalAccountBalance("borrowed"));
  const accountId = useAppSelector(getAccountId);
  const rows = useAppSelector(getAvailableAssets("borrow"));

  const columns = !accountId
    ? [...defaultColumns.filter((col) => col.dataKey !== "borrowed")]
    : defaultColumns;

  const handleOnRowClick = (rowData) => {
    const maxBorrowAmount = getMaxBorrowAmount(rowData.token_id, assets, portfolio);
    const amount = Number((maxBorrowAmount / rowData.price.usd).toFixed(PERCENT_DIGITS));

    modal.setModalData({
      type: "Borrow",
      title: "Borrow",
      totalAmountTitle: "Total Borrow",
      asset: {
        token_id: rowData.token_id,
        amount,
        name: rowData?.name || "Unknown",
        symbol: rowData?.symbol || "???",
        icon: rowData?.icon,
        valueInUSD: rowData.price?.usd || 0,
        apy: rowData.borrow_apr,
        canBeUsedAsCollateral: rowData.config.can_use_as_collateral,
      },
      buttonText: "Borrow",
      rates: [
        {
          title: "Borrow APY",
          value: `${(Number(rowData.borrow_apr) * 100).toFixed(PERCENT_DIGITS)}%`,
        },
        {
          title: "Extra Rewards APY",
          value: "0.00%",
          hidden: true,
        },
        {
          title: "Collateral Factor",
          value: `${(Number(rowData.config.volatility_ratio) / 100).toFixed(2)}%`,
        },
        {
          title: "Limit Used",
          value: "0.00%",
          hidden: true,
        },
        {
          title: "Pool Liquidity",
          value: toUsd(getAvailableAmount(rowData), rowData).toLocaleString(undefined, USD_FORMAT),
        },
      ],
      ratesTitle: "Rates",
      config: rowData.config,
    });
    modal.handleOpen();
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

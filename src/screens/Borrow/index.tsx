import { useContext } from "react";
import { Box } from "@mui/material";

import { USD_FORMAT, DECIMAL_OVERRIDES } from "../../store/constants";
import { ContractContext } from "../../context/contracts";
import { toUsd, shrinkToken, getAvailableAmount } from "../../store";
import { Burrow } from "../../index";
import { IBurrow } from "../../interfaces/burrow";

import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, PageTitle } from "../../components";
import Table from "../../components/Table";
import { ModalContext, ModalState } from "../../components/Modal";
import { columns as defaultColumns, amountBorrowedColumn } from "./tabledata";

const Borrow = () => {
  const { walletConnection } = useContext<IBurrow>(Burrow);
  const { assets, metadata, portfolio } = useContext(ContractContext);
  const modal: ModalState = useContext(ModalContext);

  const yourBorrowBalance = portfolio?.borrowed
    .map(
      (borrowed) =>
        Number(borrowed.balance) *
        (assets.find((a) => a.token_id === borrowed.token_id)?.price?.usd || 0),
    )
    .reduce((sum, a) => sum + a, 0)
    .toLocaleString(undefined, USD_FORMAT);

  const totalBorrow = assets
    .map((asset) => {
      return toUsd(asset.borrowed.balance, {
        ...asset,
        ...metadata.find((m) => m.token_id === asset.token_id)!,
      });
    })
    .reduce((sum, a) => sum + a, 0)
    .toLocaleString(undefined, USD_FORMAT);

  const columns = walletConnection?.isSignedIn()
    ? [...defaultColumns, amountBorrowedColumn(portfolio)]
    : defaultColumns;

  const rows = assets
    .filter((asset) => asset.config.can_borrow)
    .map((asset) => ({
      ...asset,
      ...metadata.find((m) => m.token_id === asset.token_id),
    }));

  const handleOnRowClick = (rowData) => {
    modal.setModalData({
      type: "Borrow",
      title: "Borrow",
      totalAmountTitle: "Total Borrow",
      asset: {
        token_id: rowData.token_id,
        amount: Number(
          shrinkToken(
            getAvailableAmount(rowData),
            DECIMAL_OVERRIDES[rowData.symbol] || rowData.decimals,
          ),
        ),
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
          value: "-0.00%",
        },
        {
          title: "Extra Rewards APY",
          value: "0.00%",
        },
        {
          title: "Risk Factor",
          value: "0.00%",
        },
        {
          title: "Limit Used",
          value: "0.00%",
        },
        {
          title: "Pool Liquidity",
          value: toUsd(getAvailableAmount(rowData), rowData).toLocaleString(undefined, USD_FORMAT),
        },
      ],
      ratesTitle: "Rates",
    });
    modal.handleOpen();
  };

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <InfoWrapper sx={{ gridTemplateColumns: "auto auto auto" }}>
        {walletConnection?.isSignedIn() && (
          <InfoBox title="Your Borrow Balance" value={yourBorrowBalance} subtitle="Portfolio" />
        )}
        <InfoBox title="Borrow Limit" value="0%" />
        <InfoBox title="Risk Factor" value="0" />
      </InfoWrapper>
      <PageTitle first="Borrow" second="Assets" />
      <Table rows={rows} columns={columns} onRowClick={handleOnRowClick} />
      <InfoWrapper>
        <InfoBox title="Total Borrow" value={totalBorrow} />
      </InfoWrapper>
    </Box>
  );
};

export default Borrow;

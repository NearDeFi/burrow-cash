import { useContext } from "react";
import { Box } from "@mui/material";

import { ContractContext } from "../../context/contracts";
import { PERCENT_DIGITS, USD_FORMAT, NEAR_DECIMALS } from "../../store/constants";
import { sumReducer, toUsd, shrinkToken } from "../../store";
import { Burrow } from "../../index";
import { IBurrow } from "../../interfaces";
import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, PageTitle } from "../../components";
import { columns as defaultColumns, amountSuppliedColumn } from "./tabledata";
import Table from "../../components/Table";
import { ModalContext, ModalState } from "../../components/Modal";

const Supply = () => {
  const { walletConnection } = useContext<IBurrow>(Burrow);
  const { assets, metadata, balances, portfolio, accountBalance } = useContext(ContractContext);
  const modal: ModalState = useContext(ModalContext);

  const yourSupplyBalance = portfolio?.supplied
    .map(
      (supplied) =>
        Number(supplied.balance) *
        (assets.find((a) => a.token_id === supplied.token_id)?.price?.usd || 0),
    )
    .reduce(sumReducer, 0)
    .toLocaleString(undefined, USD_FORMAT);

  const totalSupply = assets
    .map((asset) => {
      return toUsd(asset.supplied.balance, {
        ...asset,
        ...metadata.find((m) => m.token_id === asset.token_id)!,
      });
    })
    .reduce(sumReducer, 0)
    .toLocaleString(undefined, USD_FORMAT);

  const rows = assets
    .filter((asset) => asset.config.can_deposit)
    .map((a) => ({
      ...a,
      ...metadata.find((m) => m.token_id === a.token_id),
    }));

  const columns = walletConnection?.isSignedIn()
    ? [...defaultColumns, amountSuppliedColumn(portfolio)]
    : defaultColumns;

  const balance = accountBalance
    ? shrinkToken(accountBalance, NEAR_DECIMALS, PERCENT_DIGITS)
    : "...";

  const handleOnRowClick = (rowData) => {
    const isNear = rowData.token_id === "wrap.testnet";
    const amount = isNear
      ? Number(balance)
      : balances.find((b) => b.token_id === rowData.token_id)?.balance || 0;

    modal.setModalData({
      type: "Supply",
      title: "Supply",
      totalAmountTitle: "Total Supply",
      asset: {
        token_id: rowData.token_id,
        amount,
        name: rowData?.name || "Unknown",
        symbol: rowData?.symbol || "???",
        icon: rowData?.icon,
        valueInUSD: rowData.price?.usd || 0,
        apy: rowData.supply_apr,
        canBeUsedAsCollateral: rowData.config.can_use_as_collateral,
      },
      buttonText: "Supply",
      rates: [
        {
          title: "Deposit APY",
          value: `${Number(rowData.supply_apr).toFixed(PERCENT_DIGITS)}%`,
        },
        {
          title: "Extra Reward APY",
          value: "0.00%",
          hidden: true,
        },
        {
          title: "Total APY",
          value: "0.00%",
          hidden: true,
        },
        {
          title: "Collateral Factor",
          value: `${(Number(rowData.config.volatility_ratio) / 100).toFixed(2)}%`,
        },
      ],
      ratesTitle: "Rates",
    });
    modal.handleOpen();
  };

  return (
    <Box>
      <InfoWrapper>
        {walletConnection?.isSignedIn() && (
          <InfoBox title="Your Supply Balance" value={yourSupplyBalance} subtitle="Portfolio" />
        )}
        {false && <InfoBox title="Net APY" value="0%" />}
      </InfoWrapper>
      <PageTitle first="Supply" second="Assets" />
      <Table rows={rows} columns={columns} onRowClick={handleOnRowClick} />
      {assets.length > 0 && (
        <InfoWrapper>
          <InfoBox title="Total Supply" value={totalSupply} />
        </InfoWrapper>
      )}
    </Box>
  );
};

export default Supply;

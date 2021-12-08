import { useContext } from "react";
import { Box } from "@mui/material";

import { ContractContext } from "../../context/contracts";
import { PERCENT_DIGITS, NEAR_DECIMALS } from "../../store/constants";
import { shrinkToken } from "../../store";
import { InfoWrapper } from "../../components/InfoBox/style";
import { InfoBox, PageTitle } from "../../components";
import { columns as defaultColumns } from "./tabledata";
import Table from "../../components/Table";
import { ModalContext, ModalState } from "../../components/Modal";

import { useAppSelector } from "../../redux/hooks";
import { getTotalBalance, getAvailableAssets } from "../../redux/assetsSlice";
import { getTotalAccountBalance, getAccountId } from "../../redux/accountSlice";

const Supply = () => {
  const { assets, balances, accountBalance } = useContext(ContractContext);
  const modal: ModalState = useContext(ModalContext);

  const totalSupplyBalance = useAppSelector(getTotalBalance("supplied"));
  const yourSupplyBalance = useAppSelector(getTotalAccountBalance("supplied"));
  const accountId = useAppSelector(getAccountId);
  const rows = useAppSelector(getAvailableAssets("supply"));

  const columns = !accountId
    ? [...defaultColumns.filter((col) => col.dataKey !== "supplied")]
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
          value: `${(Number(rowData.supply_apr) * 100).toFixed(PERCENT_DIGITS)}%`,
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
      config: rowData.config,
    });
    modal.handleOpen();
  };

  return (
    <Box>
      <InfoWrapper>
        {accountId && (
          <InfoBox title="Your Supply Balance" value={yourSupplyBalance} subtitle="Portfolio" />
        )}
        {false && <InfoBox title="Net APY" value="0%" />}
      </InfoWrapper>
      <PageTitle first="Supply" second="Assets" />
      <Table rows={rows} columns={columns} onRowClick={handleOnRowClick} />
      {assets.length > 0 && (
        <InfoWrapper>
          <InfoBox title="Total Supply" value={totalSupplyBalance} />
        </InfoWrapper>
      )}
    </Box>
  );
};

export default Supply;

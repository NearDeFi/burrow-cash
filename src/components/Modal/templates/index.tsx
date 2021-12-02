import { useState } from "react";
import { Switch, Box } from "@mui/material";

import { ActionButton, ModalTitle, Rates, TokenBasicDetails, TokenInputs } from "../components";
import { ListEntry, TokenActionsInput } from "../types";
import { repay } from "../../../store/actions/repay";
import { withdraw } from "../../../store/actions/withdraw";
import { removeCollateral } from "../../../store/actions/removeCollateral";
import { addCollateral } from "../../../store/actions/addCollateral";
import { borrow } from "../../../store/actions/borrow";
import { supply } from "../../../store/actions/supply";
import { deposit } from "../../../store/actions/deposit";
import { colors } from "../../../style";

const borrowRates: ListEntry[] = [
  { value: "1.00%", title: "Borrow APY" },
  { value: "2.00%", title: "Extra Rewards APY" },
  { value: "3.00%", title: "Collateral Factor" },
  { value: "4.00%", title: "Limit Used" },
  { value: "1,000,000", title: "Pool Liquidit" },
];

export const BorrowData: TokenActionsInput = {
  type: "Borrow",
  title: "Borrow",
  totalAmountTitle: "Borrow Amount",
  buttonText: "Borrow",
  rates: borrowRates,
  ratesTitle: "Rates",
  asset: {
    token_id: "wrap.testnet",
    amount: 2,
    name: "Token Name",
    symbol: "TSYL",
    valueInUSD: 5,
    apy: 10,
    canBeUsedAsCollateral: true,
  },
};

export const TokenActionsTemplate = (input: TokenActionsInput) => {
  const { title, asset, totalAmountTitle, buttonText, rates, ratesTitle, type, config } = input;
  const [amount, setAmount] = useState(0);
  const [useAsCollateral, setUseAsCollateral] = useState(false);
  const isAdjust = type === "Adjust";

  const collateralBalance = Number(asset.collateral?.balance) || 0;
  const availableTokens = isAdjust ? collateralBalance + asset.amount : asset.amount;
  const isDisabled = isAdjust ? false : amount <= 0 || amount > availableTokens;

  return (
    <>
      <ModalTitle title={title} />
      <TokenBasicDetails tokenName={asset.name} icon={asset.icon} apy={asset.apy} />
      <TokenInputs
        availableTokens={availableTokens}
        tokenSymbol={asset.symbol}
        tokenPriceInUSD={asset.valueInUSD}
        totalAmountTitle={totalAmountTitle}
        onChange={(a) => setAmount(a)}
        defaultValue={collateralBalance}
      />
      <Rates rates={rates} ratesTitle={ratesTitle} />

      {type === "Supply" && asset.canBeUsedAsCollateral && (
        <Box
          px="1rem"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: "2em",
            padding: "1em",
            paddingTop: 0,
          }}
        >
          <div style={{ color: colors.secondary, fontSize: "14px", fontWeight: 400 }}>
            Use as Collateral
          </div>
          <div style={{ justifySelf: "end" }}>
            <Switch onChange={(event) => setUseAsCollateral(event.target.checked)} />
          </div>
        </Box>
      )}

      <ActionButton
        text={buttonText}
        isDisabled={isDisabled}
        onClick={() => {
          switch (type) {
            case "Borrow":
              void borrow(asset.token_id, amount);
              break;
            case "Supply":
              if (asset.token_id === "wrap.testnet") {
                void deposit(amount, useAsCollateral);
              } else {
                void supply(asset.token_id, amount, useAsCollateral);
              }
              break;
            case "Withdraw":
              void withdraw(asset.token_id, amount === asset.amount ? undefined : amount);
              break;
            case "Repay":
              void repay(asset.token_id, amount, config);
              break;
            case "Adjust":
              if (amount < collateralBalance) {
                void removeCollateral(
                  asset.token_id,
                  amount === asset.amount ? undefined : collateralBalance - amount,
                );
              }
              if (amount > collateralBalance) {
                void addCollateral(
                  asset.token_id,
                  amount === asset.amount ? undefined : amount - collateralBalance,
                );
              }
              break;
            default:
              break;
          }
        }}
      />
    </>
  );
};

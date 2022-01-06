import { USD_FORMAT, TOKEN_FORMAT, APY_FORMAT, PERCENT_DIGITS } from "../../store";
import type { UIAsset } from "../../interfaces";

interface Alert {
  [key: string]: {
    title: string;
    severity: "error" | "warning" | "info" | "success";
  };
}

interface Props {
  rates: Array<{ label: string; value: string }>;
  apy: number;
  action: string;
  totalTitle: string;
  healthFactor: number;
  alerts: Alert;
  remainingCollateral?: string;
}

export const getModalData = (asset): UIAsset & Props => {
  const {
    symbol,
    action,
    supplyApy,
    borrowApy,
    collateralFactor,
    availableLiquidity,
    price$,
    maxBorrowAmount,
    supplied,
    collateral,
    borrowed,
    available,
    availableNEAR,
    healthFactor,
    amount,
  } = asset;

  const data: any = {
    apy: borrowApy,
    alerts: {},
  };

  if (healthFactor >= 0 && healthFactor <= 105) {
    data.alerts["liquidation"] = {
      title: "Your health factor will be dangerously low and you're at risk of liquidation",
      severity: "error",
    };
  } else {
    delete data.alerts["liquidation"];
  }

  switch (action) {
    case "Supply":
      data.apy = supplyApy;
      data.totalTitle = `Total Supply = `;
      data.rates = [
        { label: "Deposit APY", value: `${supplyApy.toLocaleString(undefined, APY_FORMAT)}%` },
        { label: "Collateral Factor", value: collateralFactor },
      ];
      if (symbol === "wNEAR") {
        data.name = "NEAR";
        data.symbol = "NEAR";
        data.available = availableNEAR;
      }
      data.alerts = {};
      break;
    case "Borrow":
      data.totalTitle = `Total Borrow = `;
      data.available = Math.min(Math.max(0, maxBorrowAmount), availableLiquidity);
      data.available$ = (data.available * price$).toLocaleString(undefined, USD_FORMAT);
      data.rates = [
        { label: "Borrow APY", value: `${borrowApy.toLocaleString(undefined, APY_FORMAT)}%` },
        { label: "Collateral Factor", value: collateralFactor },
        {
          label: "Pool Liquidity",
          value: availableLiquidity.toLocaleString(undefined, TOKEN_FORMAT),
        },
      ];

      if (
        amount !== 0 &&
        Number(amount).toFixed(PERCENT_DIGITS) === maxBorrowAmount?.toFixed(PERCENT_DIGITS)
      ) {
        data.alerts["maxBorrow"] = {
          title: "Due to pricing fluctuations the max borrow amount is approximate",
          severity: "warning",
        };
      }
      break;
    case "Withdraw":
      data.totalTitle = `Withdraw Supply Amount = `;
      data.available = supplied + collateral;
      data.remainingCollateral = Math.abs(
        Math.min(collateral, collateral + supplied - amount),
      ).toLocaleString(undefined, TOKEN_FORMAT);
      break;
    case "Adjust":
      data.totalTitle = `Amount designated as collateral = `;
      data.available = supplied + collateral;
      break;
    case "Repay":
      data.totalTitle = `Repay Borrow Amount = `;
      data.available = Math.min(available, borrowed);
      data.alerts = {};
      break;

    default:
  }

  return { ...asset, ...data };
};

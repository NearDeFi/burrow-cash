import { USD_FORMAT, TOKEN_FORMAT } from "../../store";
import type { UIAsset } from "../../interfaces";

interface Props {
  rates: Array<{ label: string; value: string }>;
  apy: string;
  action: string;
  totalTitle: string;
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
  } = asset;

  const data: any = {
    apy: borrowApy,
  };

  switch (action) {
    case "Supply":
      data.apy = supplyApy;
      data.totalTitle = `Total Supply = `;
      data.rates = [
        { label: "Deposit APY", value: supplyApy },
        { label: "Collateral Factor", value: collateralFactor },
      ];
      if (symbol === "wNEAR") {
        data.name = "NEAR";
        data.symbol = "NEAR";
        data.available = availableNEAR;
      }
      break;
    case "Borrow":
      data.totalTitle = `Total Borrow = `;
      data.available = Math.min(maxBorrowAmount, availableLiquidity);
      data.available$ = (data.available * price$).toLocaleString(undefined, USD_FORMAT);
      data.rates = [
        { label: "Borrow APY", value: borrowApy },
        { label: "Collateral Factor", value: collateralFactor },
        {
          label: "Pool Liquidity",
          value: availableLiquidity.toLocaleString(undefined, TOKEN_FORMAT),
        },
      ];
      break;
    case "Withdraw":
      data.totalTitle = `Withdraw Supply Amount = `;
      data.available = supplied;
      break;
    case "Adjust":
      data.totalTitle = `Amount designated as collateral = `;
      data.available = supplied + collateral;
      break;
    case "Repay":
      data.totalTitle = `Repay Borrow Amount = `;
      data.available = Math.min(available, borrowed);
      break;

    default:
  }

  return { ...asset, ...data };
};

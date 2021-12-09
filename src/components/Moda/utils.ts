import { USD_FORMAT, TOKEN_FORMAT } from "../../store";

export const getModalData = (asset) => {
  const {
    symbol,
    action,
    supplyApy,
    borrowApy,
    collateralFactor,
    availableLiquidity,
    price$,
    maxBorrowAmount,
  } = asset;

  const data: any = {};

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
      }
      break;
    case "Borrow":
      data.apy = borrowApy;
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
      break;
    case "Adjust":
      data.totalTitle = `Amount designated as collateral = `;
      break;
    case "Repay":
      data.totalTitle = `Repay Borrow Amount = `;
      break;

    default:
  }

  return { ...asset, ...data };
};

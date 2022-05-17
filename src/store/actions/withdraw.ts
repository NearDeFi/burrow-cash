import BN from "bn.js";
import Decimal from "decimal.js";

import { decimalMax, decimalMin, getBurrow, nearTokenId } from "../../utils";
import { expandToken, expandTokenDecimal } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsOracle, ChangeMethodsToken } from "../../interfaces";
import { getMetadata, getTokenContract, prepareAndExecuteTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { Transaction, isRegistered } from "../wallet";
import { NEAR_DECIMALS, NO_STORAGE_DEPOSIT_CONTRACTS, STORAGE_DEPOSIT_FEE } from "../constants";
import { getAccountDetailed } from "../accounts";
import { getAssetsDetailed } from "../assets";

export async function withdraw({
  tokenId,
  extraDecimals,
  amount,
  isMax,
}: {
  tokenId: string;
  extraDecimals: number;
  amount: number;
  isMax: boolean;
}) {
  const { logicContract, oracleContract, account } = await getBurrow();
  const tokenContract = await getTokenContract(tokenId);
  const { decimals } = (await getMetadata(tokenId))!;
  const assetDetailed = await getAssetsDetailed();
  const detailedAccount = (await getAccountDetailed(account.accountId))!;
  const assets = assetDetailed.reduce((obj, asset) => {
    obj[asset.token_id] = {
      asset,
      price: asset.price
        ? new Decimal(asset.price.multiplier).div(new Decimal(10).pow(asset.price.decimals))
        : new Decimal(0),
    };
    return obj;
  }, {});
  const isNEAR = tokenId === nearTokenId;

  const suppliedBalance = new Decimal(
    detailedAccount.supplied.find((a) => a.token_id === tokenId)?.balance || 0,
  );

  const collateralBalance = new Decimal(
    detailedAccount.collateral.find((a) => a.token_id === tokenId)?.balance || 0,
  );

  let maxAmount = suppliedBalance;

  if (collateralBalance.gt(0)) {
    const adjustedCollateralSum = detailedAccount.collateral.reduce((sum, a) => {
      const { asset, price } = assets[a.token_id];
      const pricedBalance = new Decimal(a.balance)
        .div(expandTokenDecimal(1, asset.config.extra_decimals))
        .mul(price);
      const adjustedPricedBalance = pricedBalance.mul(asset.config.volatility_ratio).div(10000);
      sum = sum.add(adjustedPricedBalance);
      return sum;
    }, new Decimal(0));

    const adjustedBorrowedSum = detailedAccount.borrowed.reduce((sum, a) => {
      const { asset, price } = assets[a.token_id];
      const pricedBalance = new Decimal(a.balance)
        .div(expandTokenDecimal(1, asset.config.extra_decimals))
        .mul(price);
      const adjustedPricedBalance = pricedBalance.div(asset.config.volatility_ratio).mul(10000);
      sum = sum.add(adjustedPricedBalance);
      return sum;
    }, new Decimal(0));

    const adjustedPricedDiff = decimalMax(0, adjustedCollateralSum.sub(adjustedBorrowedSum));
    const safeAdjustedPricedDiff = adjustedPricedDiff.mul(99).div(100);
    const { asset, price } = assets[tokenId];
    // Unadjust back for collateral.
    const safePricedDiff = safeAdjustedPricedDiff.div(asset.config.volatility_ratio).mul(10000);
    // Unprice it for this collateral.
    const safeDiff = safePricedDiff
      .div(price)
      .mul(expandTokenDecimal(1, asset.config.extra_decimals))
      .trunc();

    maxAmount = maxAmount.add(decimalMin(safeDiff, collateralBalance));
  }

  const expandedAmount = isMax
    ? maxAmount
    : decimalMin(maxAmount, expandTokenDecimal(amount, decimals + extraDecimals));

  const transactions: Transaction[] = [];

  if (
    !(await isRegistered(account.accountId, tokenContract)) &&
    !NO_STORAGE_DEPOSIT_CONTRACTS.includes(tokenContract.contractId)
  ) {
    transactions.push({
      receiverId: tokenContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsToken[ChangeMethodsToken.storage_deposit],
          attachedDeposit: new BN(expandToken(STORAGE_DEPOSIT_FEE, NEAR_DECIMALS)),
        },
      ],
    });
  }

  const withdrawAction = {
    Withdraw: {
      token_id: tokenId,
      max_amount: !isMax ? expandedAmount.toFixed(0) : undefined,
    },
  };

  const decreaseCollateralAmount = decimalMax(expandedAmount.sub(suppliedBalance), 0);

  if (decreaseCollateralAmount.gt(0)) {
    transactions.push({
      receiverId: oracleContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
          args: {
            receiver_id: logicContract.contractId,
            msg: JSON.stringify({
              Execute: {
                actions: [
                  {
                    DecreaseCollateral: {
                      token_id: tokenId,
                      amount: decreaseCollateralAmount.toFixed(0),
                    },
                  },
                  withdrawAction,
                ],
              },
            }),
          },
        },
      ],
    });
  } else {
    transactions.push({
      receiverId: logicContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
          args: {
            actions: [withdrawAction],
          },
        },
      ],
    });
  }

  // 10 yocto is for rounding errors.
  if (isNEAR && expandedAmount.gt(10)) {
    transactions.push({
      receiverId: tokenContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_withdraw],
          args: {
            amount: expandedAmount.sub(10).toFixed(0),
          },
        },
      ],
    });
  }

  await prepareAndExecuteTransactions(transactions);
}

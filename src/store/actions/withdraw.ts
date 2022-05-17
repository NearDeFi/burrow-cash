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
  const detailedAccount = (await getAccountDetailed(account.accountId))!;
  const isNEAR = tokenId === nearTokenId;

  const suppliedBalance = new Decimal(
    detailedAccount.supplied.find((a) => a.token_id === tokenId)?.balance || 0,
  );

  const collateralBalance = new Decimal(
    detailedAccount.collateral.find((a) => a.token_id === tokenId)?.balance || 0,
  );

  const maxAmount = suppliedBalance.add(collateralBalance);

  const expandedAmount = decimalMin(
    maxAmount,
    expandTokenDecimal(amount, decimals + extraDecimals),
  );

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

  const decreaseCollateralAmount = isMax
    ? collateralBalance
    : decimalMax(expandedAmount.sub(suppliedBalance), 0);

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
                      amount: !isMax ? decreaseCollateralAmount.toFixed(0) : undefined,
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
            amount: isMax ? maxAmount.toFixed(0) : expandedAmount.sub(10).toFixed(0),
          },
        },
      ],
    });
  }

  await prepareAndExecuteTransactions(transactions);
}

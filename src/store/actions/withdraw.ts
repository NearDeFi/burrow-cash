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
import { getAssetDetailed } from "../assets";

export async function withdraw({
  tokenId,
  amount,
  maxAmount,
}: {
  tokenId: string;
  amount: number;
  maxAmount: number;
  isMax: boolean;
}) {
  const { logicContract, oracleContract, account } = await getBurrow();
  const tokenContract = await getTokenContract(tokenId);
  const { decimals } = (await getMetadata(tokenId))!;
  const asset = await getAssetDetailed(tokenId);
  const detailedAccount = (await getAccountDetailed(account.accountId))!;
  const isNEAR = tokenId === nearTokenId;

  const extraDecimals = asset.config.extra_decimals;
  const canUseAsCollateral = asset.config.can_use_as_collateral;

  const suppliedBalance = new Decimal(
    detailedAccount.supplied.find((a) => a.token_id === tokenId)?.balance || 0,
  );

  const maxAmountD = expandTokenDecimal(maxAmount, decimals + extraDecimals);

  const expandedAmount = decimalMin(
    maxAmountD,
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
      max_amount: expandedAmount.toFixed(0),
    },
  };

  const decreaseCollateralAmount = decimalMax(expandedAmount.sub(suppliedBalance), 0);

  if (canUseAsCollateral && decreaseCollateralAmount.gt(0)) {
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

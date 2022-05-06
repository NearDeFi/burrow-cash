import BN from "bn.js";

import { getBurrow, nearTokenId } from "../../utils";
import { expandToken } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsOracle, ChangeMethodsToken } from "../../interfaces";
import { getMetadata, getTokenContract, prepareAndExecuteTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { Transaction, isRegistered } from "../wallet";
import { NEAR_DECIMALS, NO_STORAGE_DEPOSIT_CONTRACTS, STORAGE_DEPOSIT_FEE } from "../constants";

export async function withdraw({
  tokenId,
  extraDecimals,
  amount,
  collateralAmount,
  maxAmount,
  collateral,
}: {
  tokenId: string;
  extraDecimals: number;
  amount: number;
  collateralAmount?: number;
  maxAmount?: string | number;
  collateral: number;
}) {
  const { logicContract, oracleContract, account } = await getBurrow();
  const tokenContract = await getTokenContract(tokenId);
  const { decimals } = (await getMetadata(tokenId))!;

  const isNEAR = tokenId === nearTokenId;
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
      amount: expandToken(maxAmount || amount, decimals + extraDecimals, 0),
    },
  };

  if (collateralAmount && collateralAmount > 1e-18) {
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
                      // TODO: Figure out why isNEAR handled differently.
                      amount: expandToken(
                        maxAmount ? (isNEAR ? maxAmount : collateral) : collateralAmount,
                        decimals + extraDecimals,
                        0,
                      ),
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

  if (isNEAR) {
    transactions.push({
      receiverId: tokenContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_withdraw],
          args: { amount: expandToken(maxAmount || amount, decimals + extraDecimals, 0) },
        },
      ],
    });
  }

  await prepareAndExecuteTransactions(transactions);
}

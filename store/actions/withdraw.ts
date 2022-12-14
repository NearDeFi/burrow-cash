import BN from "bn.js";
import Decimal from "decimal.js";

import { decimalMax, decimalMin, getBurrow, nearTokenId } from "../../utils";
import { expandToken, expandTokenDecimal } from "../helper";
import { ChangeMethodsLogic, ChangeMethodsOracle, ChangeMethodsToken } from "../../interfaces";
import { getTokenContract, prepareAndExecuteTransactions } from "../tokens";
import { ChangeMethodsNearToken } from "../../interfaces/contract-methods";
import { Transaction, isRegistered } from "../wallet";
import { NEAR_DECIMALS, NO_STORAGE_DEPOSIT_CONTRACTS, NEAR_STORAGE_DEPOSIT } from "../constants";
import getAssets from "../../api/get-assets";
import { transformAssets } from "../../transformers/asstets";
import getAccount from "../../api/get-account";
import { transformAccount } from "../../transformers/account";
import { computeWithdrawMaxAmount } from "../../redux/selectors/getWithdrawMaxAmount";

interface Props {
  tokenId: string;
  extraDecimals: number;
  amount: number;
  isMax: boolean;
}

export async function withdraw({ tokenId, extraDecimals, amount, isMax }: Props) {
  const assets = await getAssets().then(transformAssets);
  const account = await getAccount().then(transformAccount);
  if (!account) return;

  const asset = assets[tokenId];
  const { decimals } = asset.metadata;
  const { logicContract, oracleContract } = await getBurrow();
  const tokenContract = await getTokenContract(tokenId);
  const isNEAR = tokenId === nearTokenId;

  const suppliedBalance = new Decimal(account.portfolio?.supplied[tokenId]?.balance || 0);
  const maxAmount = computeWithdrawMaxAmount(tokenId, assets, account.portfolio!);

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
          attachedDeposit: new BN(expandToken(NEAR_STORAGE_DEPOSIT, NEAR_DECIMALS)),
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
          gas: new BN("100000000000000"),
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

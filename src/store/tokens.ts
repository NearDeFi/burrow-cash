import { Contract } from "near-api-js";
import Decimal from "decimal.js";
import BN from "bn.js";

import { getBurrow } from "../utils";
import {
  DEFAULT_PRECISION,
  NEAR_DECIMALS,
  NO_STORAGE_DEPOSIT_CONTRACTS,
  NEAR_STORAGE_DEPOSIT,
  NEAR_STORAGE_DEPOSIT_MIN,
} from "./constants";
import { expandToken, expandTokenDecimal, getContract, shrinkToken } from "./helper";
import {
  ViewMethodsLogic,
  ChangeMethodsLogic,
  ChangeMethodsToken,
  ViewMethodsToken,
  IMetadata,
  Balance,
} from "../interfaces";

import {
  executeMultipleTransactions,
  FunctionCallOptions,
  isRegistered,
  Transaction,
} from "./wallet";

Decimal.set({ precision: DEFAULT_PRECISION });

export const getTokenContract = async (tokenContractAddress: string): Promise<Contract> => {
  const { account } = await getBurrow();
  return getContract(account, tokenContractAddress, ViewMethodsToken, ChangeMethodsToken);
};

export const getMetadata = async (token_id: string): Promise<IMetadata | undefined> => {
  try {
    const { view } = await getBurrow();
    const tokenContract: Contract = await getTokenContract(token_id);

    const metadata: IMetadata = (await view(
      tokenContract,
      ViewMethodsToken[ViewMethodsToken.ft_metadata],
    )) as IMetadata;

    metadata.token_id = token_id;
    return metadata;
  } catch (err: any) {
    console.error(`Failed to get metadata for ${token_id} ${err.message}`);
    return undefined;
  }
};

export const getBalance = async (
  token_id: string,
  accountId: string,
): Promise<number | undefined> => {
  const { view } = await getBurrow();

  try {
    const tokenContract: Contract = await getTokenContract(token_id);

    const balanceInYocto: string = (await view(
      tokenContract,
      ViewMethodsToken[ViewMethodsToken.ft_balance_of],
      {
        account_id: accountId,
      },
    )) as string;

    const metadata = await getMetadata(token_id);
    const balance = shrinkToken(balanceInYocto, metadata?.decimals!);

    return Number(balance);
  } catch (err: any) {
    console.error(`Failed to get balance for ${accountId} on ${token_id} ${err.message}`);
    return 0;
  }
};

export const getAllMetadata = async (token_ids: string[]): Promise<IMetadata[]> => {
  try {
    const metadata: IMetadata[] = (
      await Promise.all(token_ids.map((token_id) => getMetadata(token_id)))
    ).filter((m): m is IMetadata => !!m);

    return metadata;
  } catch (err) {
    console.error(err);
    throw new Error("getAllMetadata");
  }
};

export const prepareAndExecuteTokenTransactions = async (
  tokenContract: Contract,
  functionCall?: FunctionCallOptions,
  additionalOperations: Transaction[] = [],
) => {
  const { account } = await getBurrow();
  const transactions: Transaction[] = [];

  const functionCalls: FunctionCallOptions[] = [];

  // check if account is registered in the token contract
  if (
    !(await isRegistered(account.accountId, tokenContract)) &&
    !NO_STORAGE_DEPOSIT_CONTRACTS.includes(tokenContract.contractId)
  ) {
    functionCalls.push({
      methodName: ChangeMethodsToken[ChangeMethodsToken.storage_deposit],
      attachedDeposit: new BN(expandToken(NEAR_STORAGE_DEPOSIT, NEAR_DECIMALS)),
    });
  }

  if (functionCall) {
    // add the actual transaction to be executed
    functionCalls.push(functionCall);
  }

  transactions.push({
    receiverId: tokenContract.contractId,
    functionCalls,
  });

  transactions.push(...additionalOperations);

  await prepareAndExecuteTransactions(transactions);
};

export const prepareAndExecuteTransactions = async (operations: Transaction[] = []) => {
  const { account, logicContract, view } = await getBurrow();
  const transactions: Transaction[] = [];

  const storageDepositTransaction = {
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.storage_deposit],
        attachedDeposit: new BN(expandToken(NEAR_STORAGE_DEPOSIT, NEAR_DECIMALS)),
      },
    ],
  };

  // check if account is registered in burrow cash
  if (!(await isRegistered(account.accountId, logicContract))) {
    transactions.push(storageDepositTransaction);
  } else {
    const balance = (await view(
      logicContract,
      ViewMethodsLogic[ViewMethodsLogic.storage_balance_of],
      {
        account_id: account.accountId,
      },
    )) as Balance;
    const balanceTotalDecimal = new Decimal(balance.total);
    const nearStorageDepositMin = expandTokenDecimal(NEAR_STORAGE_DEPOSIT_MIN, NEAR_DECIMALS);

    if (balanceTotalDecimal.lessThanOrEqualTo(nearStorageDepositMin)) {
      transactions.push(storageDepositTransaction);
    }
  }

  transactions.push(...operations);
  await executeMultipleTransactions(transactions);
};

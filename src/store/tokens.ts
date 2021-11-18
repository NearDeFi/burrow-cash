import { Contract } from "near-api-js";
import Decimal from "decimal.js";
import BN from "bn.js";

import { getBurrow } from "../utils";
import { DECIMAL_OVERRIDES, DEFAULT_PRECISION, NEAR_DECIMALS, TOKEN_DECIMALS } from "./constants";
import { expandToken, getContract, shrinkToken } from "./helper";
import {
  ChangeMethodsLogic,
  ChangeMethodsOracle,
  ChangeMethodsToken,
  ViewMethodsToken,
  IMetadata,
} from "../interfaces";
import {
  executeMultipleTransactions,
  FunctionCallOptions,
  isRegistered,
  Transaction,
} from "./wallet";
import { getAccountDetailed } from "./accounts";

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
  const metadata: IMetadata[] = (
    await Promise.all(token_ids.map((token_id) => getMetadata(token_id)))
  ).filter((m): m is IMetadata => !!m);

  console.log("metadata", metadata);
  return metadata;
};

const prepareAndExecuteTokenTransactions = async (
  tokenContract: Contract,
  functionCall: FunctionCallOptions,
  additionalOperations: Transaction[] = [],
) => {
  const { account } = await getBurrow();
  const transactions: Transaction[] = [];

  const functionCalls: FunctionCallOptions[] = [];

  // check if account is registered in the token contract
  if (!(await isRegistered(account.accountId, tokenContract))) {
    functionCalls.push({
      methodName: ChangeMethodsToken[ChangeMethodsToken.storage_deposit],
      attachedDeposit: new BN(expandToken(0.1, NEAR_DECIMALS)),
    });
  }

  // add the actual transaction to be executed
  functionCalls.push(functionCall);

  transactions.push({
    receiverId: tokenContract.contractId,
    functionCalls,
  });

  transactions.push(...additionalOperations);

  await prepareAndExecuteTransactions(transactions);
};

const prepareAndExecuteTransactions = async (operations: Transaction[] = []) => {
  const { account, logicContract } = await getBurrow();
  const transactions: Transaction[] = [];

  // check if account is registered in burrow cash
  if (!(await isRegistered(account.accountId, logicContract))) {
    transactions.push({
      receiverId: logicContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsLogic[ChangeMethodsLogic.storage_deposit],
          attachedDeposit: new BN(expandToken(0.1, NEAR_DECIMALS)),
        },
      ],
    });
  }

  transactions.push(...operations);

  console.log("transactions being dispatched", JSON.stringify(transactions, null, 2));

  await executeMultipleTransactions(transactions);
};

export const supply = async (
  token_id: string,
  amount: number,
  useAsCollateral: boolean,
): Promise<void> => {
  console.log(`Supplying ${amount} to ${token_id}`);

  const { logicContract } = await getBurrow();

  const tokenContract = await getTokenContract(token_id);
  const metadata = await getMetadata(token_id);
  const expandedAmount = expandToken(amount, metadata?.decimals! || NEAR_DECIMALS);

  console.log("transaction fixed amount", expandedAmount);

  const args = {
    actions: [
      {
        IncreaseCollateral: {
          token_id,
          amount: undefined as unknown as string,
        },
      },
    ],
  };

  if (amount) {
    args.actions[0].IncreaseCollateral.amount = expandToken(
      amount,
      metadata?.decimals || NEAR_DECIMALS,
    );
  }

  const addCollateralTx = {
    receiverId: logicContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
        args,
      },
    ],
  };

  await prepareAndExecuteTokenTransactions(
    tokenContract,
    {
      methodName: ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call],
      args: {
        receiver_id: logicContract.contractId,
        amount: expandedAmount,
        msg: "",
      },
    },
    useAsCollateral ? [addCollateralTx] : undefined,
  );
};

export const borrow = async (token_id: string, amount: number) => {
  console.log(`Borrowing ${amount} of ${token_id}`);

  const { oracleContract, logicContract, account } = await getBurrow();

  const metadata = await getMetadata(token_id);
  const accountDetailed = await getAccountDetailed(account.accountId);

  const borrowTemplate = {
    Execute: {
      actions: [
        {
          Borrow: {
            token_id,
            amount: expandToken(
              amount,
              DECIMAL_OVERRIDES[metadata?.symbol ? metadata.symbol : ""] || TOKEN_DECIMALS,
            ),
          },
        },
        {
          Withdraw: {
            token_id,
            amount: expandToken(amount, TOKEN_DECIMALS),
          },
        },
      ],
    },
  };

  const collateral = accountDetailed
    ? accountDetailed.collateral.map((c) => c.token_id).filter((t) => t !== token_id)
    : [];

  await prepareAndExecuteTransactions([
    {
      receiverId: oracleContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
          args: {
            receiver_id: logicContract.contractId,
            asset_ids: [...collateral, token_id],
            msg: JSON.stringify(borrowTemplate),
          },
        },
      ],
    } as Transaction,
  ]);
};

export const addCollateral = async (token_id: string, amount?: number) => {
  console.log(`Adding collateral ${amount} of ${token_id}`);

  const { logicContract, call } = await getBurrow();
  const metadata = await getMetadata(token_id);

  const args = {
    actions: [
      {
        IncreaseCollateral: {
          token_id,
          amount: "",
        },
      },
    ],
  };

  if (amount) {
    args.actions[0].IncreaseCollateral.amount = expandToken(
      amount,
      metadata?.decimals || NEAR_DECIMALS,
    );
  }

  await call(logicContract, ChangeMethodsLogic[ChangeMethodsLogic.execute], args);
};

export const removeCollateral = async (token_id: string, amount?: number) => {
  console.log(`Removing collateral ${amount} of ${token_id}`);

  const { logicContract, call } = await getBurrow();
  const metadata = await getMetadata(token_id);

  const args = {
    actions: [
      {
        DecreaseCollateral: {
          token_id,
          amount: undefined as unknown as string,
        },
      },
    ],
  };

  if (amount) {
    args.actions[0].DecreaseCollateral.amount = expandToken(
      amount,
      metadata?.decimals || NEAR_DECIMALS,
    );
  }

  await call(logicContract, ChangeMethodsLogic[ChangeMethodsLogic.execute], args);
};

export const withdraw = async (token_id: string, amount?: number) => {
  console.log(`Withdrawing ${amount} of ${token_id}`);

  const { call, logicContract } = await getBurrow();
  const metadata = await getMetadata(token_id);

  const args = {
    actions: [
      {
        Withdraw: {
          token_id,
          amount: undefined as unknown as string,
        },
      },
    ],
  };

  if (amount) {
    const expandedAmount = expandToken(amount, TOKEN_DECIMALS);
    args.actions[0].Withdraw.amount = expandedAmount;
    console.log("withdraw", metadata?.decimals, token_id, amount, expandedAmount);
  }

  await call(logicContract, ChangeMethodsLogic[ChangeMethodsLogic.execute], args);
};

export const repay = async (token_id: string, amount: number) => {
  console.log(`Repaying ${amount} of ${token_id}`);

  const { logicContract, call } = await getBurrow();
  const tokenContract = await getTokenContract(token_id);
  const metadata = await getMetadata(token_id);

  const msg = {
    Execute: {
      actions: [
        {
          Repay: {
            token_id,
          },
        },
      ],
    },
  };

  const args = {
    receiver_id: logicContract.contractId,
    amount: expandToken(amount, metadata?.decimals || NEAR_DECIMALS),
    msg: JSON.stringify(msg),
  };

  await call(tokenContract, ChangeMethodsToken[ChangeMethodsToken.ft_transfer_call], args);
};

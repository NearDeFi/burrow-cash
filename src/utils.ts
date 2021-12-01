import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  transactions,
  // ConnectedWalletAccount,
} from "near-api-js";
import BN from "bn.js";

import getConfig, { LOGIC_CONTRACT_NAME } from "./config";
import {
  ChangeMethodsLogic,
  ChangeMethodsOracle,
  ViewMethodsLogic,
  ViewMethodsOracle,
} from "./interfaces/contract-methods";
import { IBurrow } from "./interfaces/burrow";
import { BatchWallet, getContract, BatchWalletAccount } from "./store";

const nearConfig = getConfig(process.env.DEFAULT_NETWORK || process.env.NODE_ENV || "development");

let burrow: IBurrow;

export const getBurrow = async (): Promise<IBurrow> => {
  if (burrow) return burrow;

  // Initialize connection to the NEAR testnet
  const near = await connect({
    deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
    ...nearConfig,
  });

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  const walletConnection = new BatchWallet(near, null);

  // Getting the Account ID. If still unauthorized, it's just empty string
  const account: BatchWalletAccount = new BatchWalletAccount(
    walletConnection,
    near.connection,
    walletConnection.account().accountId,
  );

  const view = async (
    contract: Contract,
    methodName: string,
    args: Record<string, unknown> = {},
    json = true,
  ): Promise<Record<string, unknown> | string> => {
    try {
      return await account.viewFunction(contract.contractId, methodName, args, {
        // always parse to string, JSON parser will fail if its not a json
        parse: (data: Uint8Array) => {
          const result = Buffer.from(data).toString();
          return json ? JSON.parse(result) : result;
        },
      });
    } catch (err: any) {
      console.error(
        `view failed on ${contract.contractId} method: ${methodName}, ${JSON.stringify(args)}`,
      );
      throw err;
    }
  };

  const call = async (
    contract: Contract,
    methodName: string,
    args: Record<string, unknown> = {},
    deposit = "1",
  ) => {
    const gas = new BN(150000000000000);
    const attachedDeposit = new BN(deposit);

    const actions = [
      transactions.functionCall(
        methodName,
        Buffer.from(JSON.stringify(args)),
        gas,
        attachedDeposit,
      ),
    ];

    // @ts-ignore
    return account.signAndSendTransaction({
      receiverId: contract.contractId,
      actions,
    });
  };

  const logicContract: Contract = await getContract(
    walletConnection.account(),
    LOGIC_CONTRACT_NAME,
    ViewMethodsLogic,
    ChangeMethodsLogic,
  );

  // get oracle address from
  const config = (await view(logicContract, ViewMethodsLogic[ViewMethodsLogic.get_config])) as {
    oracle_account_id: string;
  };

  const oracleContract: Contract = await getContract(
    walletConnection.account(),
    config.oracle_account_id,
    ViewMethodsOracle,
    ChangeMethodsOracle,
  );

  burrow = {
    walletConnection,
    account,
    logicContract,
    oracleContract,
    view,
    call,
  } as IBurrow;

  return burrow;
};

// Initialize contract & set global variables
export async function initContract(): Promise<IBurrow> {
  return getBurrow();
}

export function logout(walletConnection: WalletConnection) {
  walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export async function login(walletConnection: WalletConnection) {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  await walletConnection.requestSignIn({
    contractId: LOGIC_CONTRACT_NAME,
  });
}

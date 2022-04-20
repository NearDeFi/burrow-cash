import { Contract } from "near-api-js";
import BN from "bn.js";

import getConfig, { LOGIC_CONTRACT_NAME } from "./config";
import {
  ChangeMethodsLogic,
  ChangeMethodsOracle,
  ViewMethodsLogic,
  ViewMethodsOracle,
} from "./interfaces/contract-methods";
import { IBurrow, IConfig } from "./interfaces/burrow";
import { getContract } from "./store";

import { getWalletSelector, getAccount, functionCall } from "./utils/wallet-selector-compat";

const defaultNetwork = process.env.DEFAULT_NETWORK || process.env.NODE_ENV || "development";

export const isTestnet = getConfig(defaultNetwork).networkId === "testnet";

export const getViewAs = () => {
  const url = new URL(window.location.href.replace("/#", ""));
  const searchParams = new URLSearchParams(url.search);
  return searchParams.get("viewAs");
};

interface GetBurrowArgs {
  fetchData?: () => void | null;
  hideModal?: () => void | null;
  signOut?: () => void | null;
}

let selector;
let burrow: IBurrow;
let resetBurrow = true;
let fetchDataCached;
let hideModalCached;
let signOutCached;

const nearTokenIds = {
  mainnet: "wrap.near",
  testnet: "wrap.testnet",
};

export const nearTokenId = nearTokenIds[defaultNetwork] || nearTokenIds.testnet;

export const getBurrow = async ({
  fetchData,
  hideModal,
  signOut,
}: GetBurrowArgs = {}): Promise<IBurrow> => {
  if (burrow && !resetBurrow) return burrow;
  resetBurrow = false;

  const changeAccount = async () => {
    resetBurrow = true;
    await getBurrow();
    if (fetchData) fetchData();
  };

  if (!selector) {
    selector = await getWalletSelector({
      onAccountChange: changeAccount,
    });
  }

  const account = await getAccount(getViewAs());

  if (!fetchDataCached && !!fetchData) fetchDataCached = fetchData;
  if (!hideModalCached && !!hideModal) hideModalCached = hideModal;
  if (!signOutCached && !!signOut)
    signOutCached = async () => {
      await selector?.signOut().catch((err) => {
        console.log("Failed to sign out");
        console.error(err);
      });
      if (hideModal) hideModal();
      signOut();
    };

  const view = async (
    contract: Contract,
    methodName: string,
    args: Record<string, unknown> = {},
    json = true,
  ): Promise<Record<string, any> | string> => {
    try {
      const viewAccount = await getAccount(getViewAs());
      return await viewAccount.viewFunction(contract.contractId, methodName, args, {
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
    const { contractId } = contract;
    const gas = new BN(150000000000000);
    const attachedDeposit = new BN(deposit);

    return functionCall({
      contractId,
      methodName,
      args,
      gas,
      attachedDeposit,
    }).catch((e) => console.log(e));
  };

  const logicContract: Contract = await getContract(
    account,
    LOGIC_CONTRACT_NAME,
    ViewMethodsLogic,
    ChangeMethodsLogic,
  );

  // get oracle address from
  const config = (await view(
    logicContract,
    ViewMethodsLogic[ViewMethodsLogic.get_config],
  )) as IConfig;

  const oracleContract: Contract = await getContract(
    account,
    config.oracle_account_id,
    ViewMethodsOracle,
    ChangeMethodsOracle,
  );

  if (localStorage.getItem("near-wallet-selector:selectedWalletId") == null) {
    if (
      localStorage.getItem("near_app_wallet_auth_key") != null ||
      localStorage.getItem("null_wallet_auth_key") != null
    ) {
      if (signOutCached) signOutCached();
    }
  }

  burrow = {
    selector,
    changeAccount,
    fetchData: fetchDataCached,
    hideModal: hideModalCached,
    signOut: signOutCached,
    account,
    logicContract,
    oracleContract,
    view,
    call,
    config,
  } as IBurrow;

  return burrow;
};

// Initialize contract & set global variables
export async function initContract(): Promise<IBurrow> {
  return getBurrow();
}

export function accountTrim(accountId: string) {
  return accountId && accountId.length > 14 + 14 + 1
    ? `${accountId.slice(0, 8)}...${accountId.slice(-8)}`
    : accountId;
}

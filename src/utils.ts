import { Contract } from "near-api-js";
import BN from "bn.js";
import Decimal from "decimal.js";

import getConfig, { defaultNetwork, LOGIC_CONTRACT_NAME } from "./config";
import {
  ChangeMethodsLogic,
  ChangeMethodsOracle,
  ViewMethodsLogic,
  ViewMethodsOracle,
} from "./interfaces/contract-methods";
import { IBurrow, IConfig } from "./interfaces/burrow";
import { getContract } from "./store";

import {
  getSelector,
  getAccount,
  functionCall,
} from "./utils/wallet-selector/wallet-selector-compat";

/// pass networkId to wallet-selector-compat then call init on near-utils / neth
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
  /// because it's being called by multiple components on startup
  /// all calls wait until setup is complete and then return burrow instance promise
  const getBurrowInternal = async () => {
    if (burrow) return burrow;
    await new Promise((res) => {
      setTimeout(() => {
        res({});
      }, 250);
    });
    return getBurrowInternal();
  };

  if (!resetBurrow) return getBurrowInternal();
  resetBurrow = false;

  const changeAccount = async () => {
    resetBurrow = true;
    await getBurrow();
    if (fetchData) fetchData();
  };

  if (!selector) {
    selector = await getSelector({
      networkId: isTestnet ? "testnet" : "mainnet",
      contractId: LOGIC_CONTRACT_NAME,
      onAccountChange: changeAccount,
    });
  }

  const account = await getAccount(getViewAs());

  if (!fetchDataCached && !!fetchData) fetchDataCached = fetchData;
  if (!hideModalCached && !!hideModal) hideModalCached = hideModal;
  if (!signOutCached && !!signOut)
    signOutCached = async () => {
      await selector?.signOut().catch((err) => {
        console.error("Failed to sign out");
        console.error(err);
      });
      if (hideModal) hideModal();
      signOut();
    };
  const signIn = () => selector.signIn();

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
    const gas = new BN(50000000000000);
    const attachedDeposit = new BN(deposit);

    return functionCall({
      contractId,
      methodName,
      args,
      gas,
      attachedDeposit,
    }).catch((e) => console.error(e));
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
    signIn,
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

const versionRegex = /index\.(.*)\.js/;

export const getLocalAppVersion = () => {
  const script = document.querySelector("#burrow-script")?.["src"];
  const version = script ? script.match(versionRegex)[1] : "0000";
  return version;
};

export const getRemoteAppVersion = async () => {
  const res = await fetch(window.location.origin);
  const html = await res.text();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(html, "text/html");
  return htmlDoc.querySelector("#burrow-script")?.["src"]?.match(versionRegex)[1];
};

export function decimalMax(a: string | number | Decimal, b: string | number | Decimal): Decimal {
  a = new Decimal(a);
  b = new Decimal(b);
  return a.gt(b) ? a : b;
}

export function decimalMin(a: string | number | Decimal, b: string | number | Decimal): Decimal {
  a = new Decimal(a);
  b = new Decimal(b);
  return a.lt(b) ? a : b;
}

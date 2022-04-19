import NearWalletSelector from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { Near } from "near-api-js/lib/near";
import { Account } from "near-api-js/lib/account";
import { BrowserLocalStorageKeyStore } from "near-api-js/lib/key_stores";
import BN from "bn.js";
import getConfig, { LOGIC_CONTRACT_NAME } from "../config";
import { nearWalletIcon, senderWalletIcon } from "../assets/icons";

const defaultNetwork =
  process.env.DEFAULT_NETWORK === "development" || "testnet" ? "testnet" : "mainnet";

// caches in module so we don't re-init every time we need it
let near: Near;
let accountId;
let init = false;
let selector: NearWalletSelector | null = null;

interface WalletMethodArgs {
  signerId?: string;
  contractId?: string;
  methodName?: string;
  args?: any;
  gas?: string | BN;
  attachedDeposit?: string | BN;
}

export const getWalletSelector = async ({ onAccountChange }) => {
  if (init) return selector;
  init = true;

  selector = await NearWalletSelector.init({
    wallets: [
      setupNearWallet({
        iconUrl: nearWalletIcon,
      }),
      setupSender({
        iconUrl: senderWalletIcon,
      }),
    ],
    network: defaultNetwork,
    contractId: LOGIC_CONTRACT_NAME,
  });

  selector.on("accountsChanged", (e) => {
    accountId = e.accounts[0]?.accountId;
    if (accountId) {
      onAccountChange(accountId);
    }
  });

  const defaultAccountId = (await selector.getAccounts())?.[0]?.accountId;
  if (defaultAccountId) accountId = defaultAccountId;

  await onAccountChange(accountId);

  return selector;
};

export const getNear = () => {
  const config = getConfig(defaultNetwork);
  const keyStore = new BrowserLocalStorageKeyStore();
  if (!near) {
    near = new Near({
      ...config,
      deps: { keyStore },
    });
  }
  return near;
};

export const getAccount = async (viewAsAccountId: string | null) => {
  near = getNear();
  return new Account(near.connection, viewAsAccountId || accountId);
};

// export const viewFunction = async ({ contractId, methodName, args }: WalletMethodArgs) => {
//   if (!selector) {
//     throw new Error("selector not initialized");
//   }
//   if (!contractId) {
//     throw new Error("viewFunction error: contractId undefined");
//   }
//   if (!methodName) {
//     throw new Error("viewFunction error: methodName undefined");
//   }

//   const account = await getAccount();

//   if (!account) {
//     throw new Error("not signed in");
//   }

//   return account.viewFunction(contractId || "", methodName, args);
// };

export const functionCall = async ({
  contractId,
  methodName,
  args,
  gas,
  attachedDeposit,
}: WalletMethodArgs) => {
  if (!selector) {
    throw new Error("selector not initialized");
  }
  if (!contractId) {
    throw new Error("functionCall error: contractId undefined");
  }
  if (!methodName) {
    throw new Error("functionCall error: methodName undefined");
  }

  return selector.signAndSendTransaction({
    receiverId: contractId,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName,
          args,
          gas: gas?.toString() || "30000000000000",
          deposit: attachedDeposit?.toString() || "0",
        },
      },
    ],
  });
};

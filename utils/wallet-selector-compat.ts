import { setupWalletSelector } from "@near-wallet-selector/core";
import type { WalletSelector } from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import { setupModal } from "@near-wallet-selector/modal-ui";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { Near } from "near-api-js/lib/near";
import { Account } from "near-api-js/lib/account";
import { BrowserLocalStorageKeyStore } from "near-api-js/lib/key_stores";
import BN from "bn.js";

import getConfig, { defaultNetwork, LOGIC_CONTRACT_NAME, WALLET_CONNECT_ID } from "./config";
import { isTestnet } from ".";

declare global {
  interface Window {
    selector: WalletSelector;
    modal: WalletSelectorModal;
  }
}

interface WalletMethodArgs {
  signerId?: string;
  contractId?: string;
  methodName?: string;
  args?: any;
  gas?: string | BN;
  attachedDeposit?: string | BN;
}

interface GetWalletSelectorArgs {
  onAccountChange: (accountId?: string | null) => void;
}

// caches in module so we don't re-init every time we need it
let near: Near;
let accountId: string;
let init = false;
let selector: WalletSelector | null = null;

const walletConnect = setupWalletConnect({
  projectId: WALLET_CONNECT_ID,
  metadata: {
    name: "Burrow Cash",
    description: "Burrow with NEAR Wallet Selector",
    url: "https://github.com/near/wallet-selector",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
  chainId: `near:${defaultNetwork}`,
});

export const getWalletSelector = async ({ onAccountChange }: GetWalletSelectorArgs) => {
  if (init) return selector;
  init = true;

  selector = await setupWalletSelector({
    modules: [setupNearWallet(), setupSender(), walletConnect],
    network: defaultNetwork,
    debug: !!isTestnet,
  });

  // @ts-ignore - accountsChanged is not (yet) in the type definition in @near-wallet-selector/core
  // selector.on("accountsChanged", (e) => {
  //   // @ts-ignore
  //   accountId = e.accounts[0]?.accountId;
  //   if (accountId) {
  //     onAccountChange(accountId);
  //   }
  // });

  selector.on("accountsChanged", (e) => {
    console.info("accountsChanged", e);
    onAccountChange();
  });

  const state = selector.store.getState();
  const wallet = await selector.wallet(state.selectedWalletId ?? "near-wallet");
  const defaultAccountId = (await wallet.getAccounts())?.[0]?.accountId;
  if (defaultAccountId) accountId = defaultAccountId;

  await onAccountChange(accountId);

  const modal = setupModal(selector, { contractId: LOGIC_CONTRACT_NAME });
  window.modal = modal;

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

  const wallet = await selector.wallet();

  return wallet.signAndSendTransaction({
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

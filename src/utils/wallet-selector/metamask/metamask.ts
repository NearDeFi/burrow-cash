import {
  WalletModuleFactory,
  InjectedWallet,
  Action,
  FunctionCallAction,
  WalletBehaviourFactory,
  waitFor,
} from "@near-wallet-selector/core";
import { getNear, signIn, signOut, signAndSendTransactions } from "./neth";

declare global {
  interface Window {
    ethereum: { chainId: string };
  }
}

export interface MetaMaskParams {
  iconUrl?: string;
}

const isInstalled = () => {
  return !!window.ethereum;
};

const isMobile = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor);
  return check;
};

const MetaMask: WalletBehaviourFactory<InjectedWallet> = async ({ metadata, logger }) => {
  const isValidActions = (actions: Array<Action>): actions is Array<FunctionCallAction> => {
    return actions.every((x) => x.type === "FunctionCall");
  };

  const transformActions = (actions: Array<Action>) => {
    const validActions = isValidActions(actions);

    if (!validActions) {
      throw new Error(`Only 'FunctionCall' actions types are supported by ${metadata.name}`);
    }

    return actions.map((x) => x.params);
  };

  // return the wallet interface for wallet-selector
  return {
    async signIn() {
      let account;
      try {
        account = await signIn();
      } catch (e: any) {
        if (!/not connected/.test(e.toString())) throw e;
        // console.log(e);
      }
      return [account];
    },

    async signOut() {
      await signOut();
    },

    async getAccounts() {
      const { accountId } = await getNear();
      return [{ accountId }];
    },

    async signAndSendTransaction({ receiverId, actions }) {
      logger.log("MetaMask:signAndSendTransaction", {
        receiverId,
        actions,
      });

      return signAndSendTransactions({
        transactions: [
          {
            receiverId,
            actions: transformActions(actions),
          },
        ],
      });
    },

    async signAndSendTransactions({ transactions }) {
      logger.log("MetaMask:signAndSendTransactions", { transactions });

      const transformedTxs = transactions.map(({ receiverId, actions }) => ({
        receiverId,
        actions: transformActions(actions),
      }));

      return signAndSendTransactions({
        transactions: transformedTxs,
      });
    },
  };
};

export function setupMetaMask({
  iconUrl = "./assets/sender-icon.png",
}: MetaMaskParams = {}): WalletModuleFactory<InjectedWallet> {
  return async () => {
    const mobile = isMobile();
    const installed = await isInstalled();

    if (mobile || !installed) {
      return null;
    }

    await waitFor(() => !!window.near?.isSignedIn(), { timeout: 300 }).catch(() => false);

    return {
      id: "metamask",
      type: "injected",
      metadata: {
        name: "NETH Account",
        description: null,
        iconUrl,
        downloadUrl:
          "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
        deprecated: false,
      },
      init: MetaMask,
    };
  };
}

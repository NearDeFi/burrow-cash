import { createContext, ReactElement, useEffect, useState } from "react";
import { Account } from "near-api-js";

import { IAssetDetailed, IMetadata, IAccountDetailed, IBalance } from "../interfaces";
import { getAssetsDetailed, getBalances, getPortfolio, getAllMetadata, getAccount } from "../store";

const initialContractsState: {
  assets: IAssetDetailed[];
  balances: IBalance[];
  metadata: IMetadata[];
  portfolio?: IAccountDetailed;
  account?: Account;
  accountBalance?: string;
} = {
  assets: [],
  balances: [],
  metadata: [],
  account: undefined,
  accountBalance: undefined,
};

export const ContractContext = createContext(initialContractsState);

export const ContractContextProvider = ({ children }: { children: ReactElement }) => {
  const [assets, setAssets] = useState<IAssetDetailed[]>([]);
  const [balances, setBalances] = useState<IBalance[]>([]);
  const [metadata, setMetadata] = useState<IMetadata[]>([]);
  const [portfolio, setPortfolio] = useState<IAccountDetailed>();
  const [account, setAccount] = useState<Account>();
  const [accountBalance, setAccountBalance] = useState<string>();

  useEffect(() => {
    (async () => {
      const a = await getAssetsDetailed();
      setAssets(a);

      const [m, b] = await Promise.all([
        getAllMetadata(a.map((asset) => asset.token_id)),
        getBalances(a.map((asset) => asset.token_id)),
      ]);

      setMetadata(m);
      setBalances(b);

      const p = await getPortfolio(m, a);
      if (p) {
        setPortfolio(p);
      }

      const acc = await getAccount();
      if (acc.accountId) {
        setAccount(acc);
        setAccountBalance((await acc.getAccountBalance()).available);
      }

      // console.info(a, m, b);
    })();
  }, []);

  const state: {
    assets: IAssetDetailed[];
    balances: IBalance[];
    metadata: IMetadata[];
    portfolio?: IAccountDetailed;
    account?: Account;
    accountBalance?: string;
  } = {
    assets,
    balances,
    metadata,
    portfolio,
    account,
    accountBalance,
  };

  return <ContractContext.Provider value={state}>{children}</ContractContext.Provider>;
};

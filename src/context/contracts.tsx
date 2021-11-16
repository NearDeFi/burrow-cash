import { createContext, ReactElement, useEffect, useState } from "react";
import { IAssetDetailed, IMetadata, IAccountDetailed, IBalance } from "../interfaces";
import { getAssetsDetailed, getBalances, getPortfolio, getAllMetadata } from "../store";

const initialContractsState: {
  assets: IAssetDetailed[];
  balances: IBalance[];
  metadata: IMetadata[];
  portfolio?: IAccountDetailed;
} = {
  assets: [],
  balances: [],
  metadata: [],
};

export const ContractContext = createContext(initialContractsState);

export const ContractContextProvider = ({ children }: { children: ReactElement }) => {
  const [assets, setAssets] = useState<IAssetDetailed[]>([]);
  const [balances, setBalances] = useState<IBalance[]>([]);
  const [metadata, setMetadata] = useState<IMetadata[]>([]);
  const [portfolio, setPortfolio] = useState<IAccountDetailed>();

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

      const p = await getPortfolio(m);
      if (p) {
        setPortfolio(p);
      }
    })();
  }, []);

  const state: {
    assets: IAssetDetailed[];
    balances: IBalance[];
    metadata: IMetadata[];
    portfolio?: IAccountDetailed;
  } = {
    assets,
    balances,
    metadata,
    portfolio,
  };

  return <ContractContext.Provider value={state}>{children}</ContractContext.Provider>;
};

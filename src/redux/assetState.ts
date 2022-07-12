import { IAssetDetailed, IMetadata, IAssetFarmReward, INetTvlFarmReward } from "../interfaces";

export type Asset = Omit<IAssetDetailed, "farms"> & {
  metadata: IMetadata;
  farms: {
    supplied: {
      [token: string]: IAssetFarmReward;
    };
    borrowed: {
      [token: string]: IAssetFarmReward;
    };
  };
};

export interface Assets {
  [id: string]: Asset;
}
export interface AssetsState {
  data: Assets;
  netTvlFarm: INetTvlFarmReward;
  status: "pending" | "fulfilled" | "rejected" | "fetching" | null;
  fetchedAt: string | undefined;
}

export const initialState: AssetsState = {
  data: {},
  netTvlFarm: {},
  status: null,
  fetchedAt: undefined,
};

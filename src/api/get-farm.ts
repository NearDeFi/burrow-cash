import { getBurrow } from "../utils";
import { ViewMethodsLogic } from "../interfaces/contract-methods";
import { NetTvlFarm } from "../interfaces";

const getFarm = async (farmId: "NetTvl"): Promise<NetTvlFarm> => {
  const { view, logicContract } = await getBurrow();

  try {
    const farms = (await view(logicContract, ViewMethodsLogic[ViewMethodsLogic.get_asset_farm], {
      farm_id: farmId,
    })) as NetTvlFarm;

    return farms;
  } catch (e) {
    console.error(e);
    throw new Error("getFarm");
  }
};

export default getFarm;

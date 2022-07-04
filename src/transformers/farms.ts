import { pick } from "ramda";

const transformFarmRewards = (rewards) =>
  rewards.reduce(
    (o, item) => ({
      ...o,
      [item["reward_token_id"]]: {
        ...pick(["boosted_shares", "unclaimed_amount", "asset_farm_reward"], item),
      },
    }),
    {},
  );

export const transformAccountFarms = (list) => {
  const farms = {
    supplied: {},
    borrowed: {},
    netTvl: {},
  };

  const netTvlFarms = list.find((f) => f.farm_id === "NetTvl");
  const restFarms = list.filter((f) => f.farm_id !== "NetTvl");

  restFarms.forEach((farm) => {
    const [action, token] = Object.entries(farm["farm_id"])
      .flat()
      .map((s: any) => s.toLowerCase());

    farms[action] = {
      ...farms[action],
      [token]: transformFarmRewards(farm.rewards),
    };
  });

  farms.netTvl = transformFarmRewards(netTvlFarms.rewards);
  return farms;
};

export const transformAssetFarms = (list) => {
  const farms = {
    supplied: {},
    borrowed: {},
  };
  list.forEach((farm) => {
    const [action] = Object.entries(farm["farm_id"])
      .flat()
      .map((s: any) => s.toLowerCase());
    farms[action] = { ...farms[action], ...farm.rewards };
  });
  return farms;
};

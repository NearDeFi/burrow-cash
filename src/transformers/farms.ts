import { pick } from "ramda";

export const transformAccountFarms = (list) => {
  const farms = {
    supplied: {},
    borrowed: {},
  };

  list.forEach((farm) => {
    const [action, token] = Object.entries(farm["farm_id"])
      .flat()
      .map((s: any) => s.toLowerCase());

    farms[action] = {
      ...farms[action],
      [token]: farm.rewards.reduce(
        (o, item) => ({
          ...o,
          [item["reward_token_id"]]: {
            ...pick(["boosted_shares", "unclaimed_amount", "asset_farm_reward"], item),
          },
        }),
        {},
      ),
    };
  });

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

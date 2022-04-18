import { Stack, Typography } from "@mui/material";

import { ExtraReward } from "../../interfaces/asset";
import { shrinkToken } from "../../store/helper";
import TokenIcon from "../TokenIcon";

interface Props {
  rewards: ExtraReward[];
}

const ExtraRewards = ({ rewards: extra }: Props) => {
  return (
    <Stack spacing={1}>
      {extra.map(({ metadata, rewards, config }) => {
        const dailyRewards = shrinkToken(
          rewards.reward_per_day || 0,
          metadata.decimals + config.extra_decimals,
        );

        return (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            justifyContent="flex-end"
            key={metadata.token_id}
          >
            <Typography fontSize="0.75rem">{dailyRewards}</Typography>
            <TokenIcon width={14} height={14} icon={metadata.icon} />
          </Stack>
        );
      })}
    </Stack>
  );
};

export default ExtraRewards;

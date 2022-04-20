import { Stack, Typography } from "@mui/material";
import millify from "millify";

import { formatRewardAmount } from "../Table/common/cells";
import { IReward } from "../../interfaces/asset";
import { shrinkToken } from "../../store/helper";
import { useFullDigits } from "../../hooks";
import TokenIcon from "../TokenIcon";

interface Props {
  rewards?: IReward[];
}

const Rewards = ({ rewards: extra }: Props) => {
  const { fullDigits } = useFullDigits();
  const isCompact = fullDigits.table;

  if (!extra) return null;
  return (
    <Stack spacing={1}>
      {extra.map(({ metadata, rewards, config }) => {
        const dailyRewards = shrinkToken(
          rewards.reward_per_day || 0,
          metadata.decimals + config.extra_decimals,
        );

        const amount = isCompact
          ? millify(Number(dailyRewards))
          : formatRewardAmount(Number(dailyRewards));

        return (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            justifyContent="flex-end"
            key={metadata.token_id}
          >
            <Typography fontSize="0.75rem">{amount}</Typography>
            <TokenIcon width={14} height={14} icon={metadata.icon} />
          </Stack>
        );
      })}
    </Stack>
  );
};

export default Rewards;

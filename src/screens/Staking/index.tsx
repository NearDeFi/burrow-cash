import { useLayoutEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";

import StakingPieSvg from "./pie.svg";
import { BrrrLogo, StakingPill, StakingCard } from "./components";
import { useAppSelector } from "../../redux/hooks";
import { getTotalBRRR } from "../../redux/selectors/getTotalBRRR";
import { TOKEN_FORMAT } from "../../store";
import { getAccountRewards } from "../../redux/selectors/getAccountRewards";
import { useStaking } from "../../hooks/useStaking";
import { useClaimAllRewards } from "../../hooks/useClaimAllRewards";
import { trackUnstake } from "../../telemetry";
import { unstake } from "../../store/actions/unstake";

const Staking = () => {
  const [total] = useAppSelector(getTotalBRRR);
  const rewards = useAppSelector(getAccountRewards);
  const { unclaimedAmount = 0, dailyAmount = 0 } = rewards.brrr;
  const [unclaimed, setUnclaimed] = useState<number>(unclaimedAmount);
  const { BRRR, stakingTimestamp } = useStaking();
  const { handleClaimAll, isLoading } = useClaimAllRewards("staking");
  const [loadingUnstake, setLoadingUnstake] = useState(false);

  const count = dailyAmount / 24 / 3600 / 10;
  const unstakeDate = DateTime.fromMillis(stakingTimestamp / 1e6);
  const disabledUnstake = DateTime.now() < unstakeDate;

  useLayoutEffect(() => {
    setUnclaimed(unclaimedAmount);
    const timer = setInterval(() => setUnclaimed((u) => u + count), 60);
    return () => clearInterval(timer);
  }, [unclaimedAmount]);

  const handleUnstake = () => {
    trackUnstake();
    unstake();
    setLoadingUnstake(true);
  };

  const handleStake = () => {
    console.info("Stake");
  };

  return (
    <Stack
      alignItems="center"
      mt="2rem"
      spacing="2rem"
      sx={{ px: ["0rem", "2rem"], mx: "auto", mb: "2rem" }}
    >
      <StakingPieSvg />
      <Stack direction="row" alignItems="center" spacing={2}>
        <BrrrLogo />
        <Typography fontWeight="semibold" fontSize={{ xs: "1.5rem", sm: "2rem" }} color="#232323">
          {(total + unclaimed).toLocaleString(undefined, TOKEN_FORMAT)} BRRR
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2}>
        <StakingPill>Staked</StakingPill>
        <StakingPill sx={{ background: "#594a42" }}>Available</StakingPill>
        <StakingPill sx={{ background: "#47c285" }}>Unclaimed</StakingPill>
      </Stack>
      <Stack
        spacing={2}
        direction={{ xs: "column-reverse", sm: "row" }}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <StakingCard
          value={BRRR.toLocaleString(undefined, TOKEN_FORMAT)}
          label={`Staked until ${unstakeDate.toFormat("yyyy-MM-dd / HH:mm")}`}
          buttonLabel="Unstake"
          isDisabled={disabledUnstake}
          isLoading={loadingUnstake}
          onClick={handleUnstake}
        />
        <StakingCard
          value={total.toLocaleString(undefined, TOKEN_FORMAT)}
          label="Available to stake"
          color="#594a42"
          buttonLabel="Stake"
          onClick={handleStake}
        />
        <StakingCard
          value={unclaimed.toLocaleString(undefined, TOKEN_FORMAT)}
          label="Unclaimed rewards"
          color="#47c285"
          buttonLabel="Claim"
          onClick={handleClaimAll}
          isLoading={isLoading}
        />
      </Stack>
    </Stack>
  );
};

export default Staking;

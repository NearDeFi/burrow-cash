import { useState, useEffect } from "react";
import { Box, Stack, Typography, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { DateTime } from "luxon";

import { TOKEN_FORMAT } from "../../store/constants";
import { useAppSelector } from "../../redux/hooks";
import { getTotalBRRR } from "../../redux/accountSelectors";
import { TotalBRRR, Input } from "../../components";
import { NotConnected } from "../../components/Modal/components";
import { stake } from "../../store/actions/stake";
import { unstake } from "../../store/actions/unstake";
import MonthSlider from "../../components/Slider/staking";
import Slider from "../../components/Slider";
import { trackMaxStaking, trackStaking, trackUnstake } from "../../telemetry";
import { useAccountId, useRewards, useStaking } from "../../hooks";
import TokenIcon from "../../components/TokenIcon";

const Staking = () => {
  const accountId = useAccountId();
  const [total] = useAppSelector(getTotalBRRR);
  const [amount, setAmount] = useState(0);
  const [months, setMonths] = useState(1);
  const [loadingStake, setLoadingStake] = useState(false);
  const [loadingUnstake, setLoadingUnstake] = useState(false);
  const { xBRRR, xBooster, staking, config } = useStaking();

  const handleMaxClick = () => {
    trackMaxStaking({ total });
    setAmount(total);
  };

  const handleInputChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handleSliderChange = (e) => {
    const { value: percent } = e.target;
    setAmount((Number(total) * percent) / 100);
  };

  const handleMonthSliderChange = (e) => {
    setMonths(e.target.value);
  };

  const handleStake = () => {
    trackStaking({ amount, months });
    stake({ amount, months });
    setLoadingStake(true);
  };

  const handleUnstake = () => {
    trackUnstake();
    unstake();
    setLoadingUnstake(true);
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const stakingTimestamp = Number(staking["unlock_timestamp"]);
  const unstakeDate = DateTime.fromMillis(stakingTimestamp / 1e6);
  const selectedMonths = stakingTimestamp ? Math.round(unstakeDate.diffNow().as("months")) : 1;

  const invalidAmount = amount > total;
  const invalidMonths = months < selectedMonths;

  const disabledStake = !amount || invalidAmount || invalidMonths;

  const disabledUnstake = DateTime.now() < unstakeDate;

  const inputAmount = `${amount}`
    .replace(/[^0-9.-]/g, "")
    .replace(/(?!^)-/g, "")
    .replace(/^0+(\d)/gm, "$1");

  const xBoosterMultiplier =
    1 +
    ((months * config.minimum_staking_duration_sec - config.minimum_staking_duration_sec) /
      (config.maximum_staking_duration_sec - config.minimum_staking_duration_sec)) *
      (config.x_booster_multiplier_at_maximum_staking_duration / 10000 - 1);

  const extraXBoosterAmount = amount * xBoosterMultiplier;

  const sliderValue = Math.round((amount * 100) / total) || 0;

  useEffect(() => {
    setMonths(selectedMonths);
  }, [staking]);

  return (
    <Box mt="2rem">
      {accountId && (
        <>
          <TotalBRRR />
          <Box
            width={["100%", "580px"]}
            mx="auto"
            mt="-1rem"
            mb="1rem"
            bgcolor="#d7f0e5"
            boxShadow="0px 1px 1px rgba(0, 7, 65, 0.1)"
            px="1rem"
            py={["1.5rem", "0.75rem"]}
            borderRadius="0.3rem"
            justifyContent="space-between"
            display="flex"
            flexDirection={["column", "row"]}
            alignItems="center"
          >
            <Box>
              <Typography component="span" mr="1rem" fontSize="0.875rem">
                Staked xBRRR: <b>{xBRRR}</b>
              </Typography>
              <Typography component="span" mr="1rem" fontSize="0.875rem">
                xBooster: <b>{xBooster}</b>
              </Typography>
              <Typography component="div" fontSize="0.875rem" mt="0.5rem">
                Unstake date:{" "}
                <b>
                  {stakingTimestamp
                    ? unstakeDate.toFormat("dd / LLL / yyyy @ HH:mm")
                    : "-- / -- / ----"}
                </b>
              </Typography>
            </Box>
            <LoadingButton
              size="small"
              color="secondary"
              variant="outlined"
              onClick={handleUnstake}
              loading={loadingUnstake}
              disabled={disabledUnstake}
              sx={{ height: "30px", px: "0.8rem", mt: ["1rem", 0] }}
            >
              Unstake
            </LoadingButton>
          </Box>
        </>
      )}
      <Stack
        spacing={3}
        width={["100%", "580px"]}
        mx="auto"
        mb="2rem"
        bgcolor="#fff"
        boxShadow="0px 1px 1px rgba(0, 7, 65, 0.1)"
        px="1rem"
        py={["1.5rem", "0.75rem"]}
        borderRadius="0.3rem"
        justifyContent="space-between"
        position="relative"
      >
        {!accountId && <NotConnected />}
        <Stack spacing={1}>
          <Typography>Amount of BRRR to stake:</Typography>
          <Input
            value={inputAmount}
            type="number"
            step="0.01"
            onClickMax={handleMaxClick}
            onChange={handleInputChange}
            onFocus={handleFocus}
          />
          <Box px="0.5rem" my="1rem">
            <Slider value={sliderValue} onChange={handleSliderChange} />
          </Box>
          {invalidAmount && (
            <Alert severity="error">Amount must be lower than total BRRR earned</Alert>
          )}
        </Stack>
        <Stack spacing={1}>
          <Typography>Number of months:</Typography>
          <Box px="0.5rem">
            <MonthSlider value={months} onChange={handleMonthSliderChange} />
          </Box>
          {invalidMonths && (
            <Alert severity="error">
              The new staking duration is shorter than the current remaining staking duration
            </Alert>
          )}
        </Stack>
        <Alert severity="info">
          <Stack spacing={0.75}>
            <Box>
              xBooster multiplier: <b>{xBoosterMultiplier}x</b>
            </Box>
            <Box>
              xBooster amount: <b>{extraXBoosterAmount.toLocaleString(undefined, TOKEN_FORMAT)}</b>
            </Box>
            <BoostedRewards amount={amount} />
          </Stack>
        </Alert>
        <Box display="flex" justifyContent="center" width="100%">
          <LoadingButton
            disabled={disabledStake}
            variant="contained"
            onClick={handleStake}
            loading={loadingStake}
            sx={{ px: "4rem " }}
          >
            Stake
          </LoadingButton>
        </Box>
      </Stack>
    </Box>
  );
};

const BoostedRewards = ({ amount }) => {
  const { extra } = useRewards();
  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" alignItems="center" gap={1} pt="1rem">
      <Typography fontSize="0.85rem" textAlign="left" fontWeight="bold">
        Extra rewards
      </Typography>
      <Typography fontSize="0.85rem" textAlign="right" fontWeight="bold">
        Daily
      </Typography>
      <Typography fontSize="0.85rem" textAlign="center" fontWeight="bold">
        Multiplier
      </Typography>
      <Typography fontSize="0.85rem" textAlign="right" fontWeight="bold">
        Boosted
      </Typography>
      {extra.map(([tokenId, r]) => (
        <Reward key={tokenId} {...r} amount={amount} />
      ))}
    </Box>
  );
};

const Reward = ({ icon, dailyAmount, symbol, amount, boosterLogBase }) => {
  const multiplier = 1 + Math.log(amount || 1) / Math.log(boosterLogBase || 100);

  return (
    <>
      <Stack direction="row" gap={1}>
        <TokenIcon width={18} height={18} icon={icon} />
        <Typography fontSize="0.85rem" textAlign="left">
          {symbol}
        </Typography>
      </Stack>
      <Typography fontSize="0.85rem" textAlign="right">
        {dailyAmount.toLocaleString(undefined, TOKEN_FORMAT)}
      </Typography>
      <Typography fontSize="0.85rem" textAlign="center">
        {multiplier.toFixed(2)}x
      </Typography>
      <Typography fontSize="0.85rem" textAlign="right">
        {(dailyAmount * multiplier).toLocaleString(undefined, TOKEN_FORMAT)}
      </Typography>
    </>
  );
};

export default Staking;

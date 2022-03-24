import { useState, useEffect } from "react";
import { Box, Stack, Typography, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { DateTime } from "luxon";

import { TOKEN_FORMAT } from "../../store/constants";
import { shrinkToken } from "../../store/helper";
import { useAppSelector } from "../../redux/hooks";
import { getAccountId, getTotalBRRR, getStaking } from "../../redux/accountSelectors";
import { getConfig } from "../../redux/appSelectors";
import { TotalBRRR, Input } from "../../components";
import { NotConnected } from "../../components/Modal/components";
import { stake } from "../../store/actions/stake";
import { unstake } from "../../store/actions/unstake";
import Slider from "../../components/Slider/staking";

const Staking = () => {
  const accountId = useAppSelector(getAccountId);
  const [total] = useAppSelector(getTotalBRRR);
  const staking = useAppSelector(getStaking);
  const config = useAppSelector(getConfig);
  const [amount, setAmount] = useState(0);
  const [months, setMonths] = useState(1);
  const [loadingStake, setLoadingStake] = useState(false);
  const [loadingUnstake, setLoadingUnstake] = useState(false);

  const handleMaxClick = () => {
    setAmount(total);
  };

  const handleInputChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handleSliderChange = (e) => {
    setMonths(e.target.value);
  };

  const handleStake = () => {
    stake({ amount, months });
    setLoadingStake(true);
  };

  const handleUnstake = () => {
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

  const xBRRR = Number(
    shrinkToken(staking["staked_booster_amount"], config.booster_decimals),
  ).toLocaleString(undefined, TOKEN_FORMAT);
  const booster = Number(
    shrinkToken(staking["x_booster_amount"], config.booster_decimals),
  ).toLocaleString(undefined, TOKEN_FORMAT);

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

  useEffect(() => {
    setMonths(selectedMonths);
  }, [staking]);

  return (
    <Box mt="2rem">
      {accountId && (
        <>
          <TotalBRRR showAction />
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
                Booster: <b>{booster}</b>
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
          {invalidAmount && (
            <Alert severity="error">Amount must be lower than total BRRR earned</Alert>
          )}
        </Stack>
        <Stack spacing={1}>
          <Typography>Number of months:</Typography>
          <Box px="0.5rem">
            <Slider value={months} onChange={handleSliderChange} />
          </Box>
          {invalidMonths && (
            <Alert severity="error">
              The new staking duration is shorter than the current remaining staking duration
            </Alert>
          )}
        </Stack>
        <Alert severity="info">
          <div>
            Booster multiplier: <b>{xBoosterMultiplier.toFixed(2)}</b>
          </div>
          <div>
            Extra Booster amount:{" "}
            <b>{extraXBoosterAmount.toLocaleString(undefined, TOKEN_FORMAT)}</b>
          </div>
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

export default Staking;

import { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { DateTime } from "luxon";

import { TOKEN_DECIMALS, TOKEN_FORMAT } from "../../store/constants";
import { shrinkToken } from "../../store/helper";
import { useAppSelector } from "../../redux/hooks";
import { getAccountId, getTotalBRRR, getStaking } from "../../redux/accountSelectors";
import { TotalBRRR, Input } from "../../components";
import { NotConnected } from "../../components/Modal/components";
import { PERCENT_DIGITS } from "../../store";
import { stake } from "../../store/actions/stake";
import { unstake } from "../../store/actions/unstake";
import Slider from "../../components/Slider/staking";

const Staking = () => {
  const accountId = useAppSelector(getAccountId);
  const [total] = useAppSelector(getTotalBRRR);
  const staking = useAppSelector(getStaking);
  const [amount, setAmount] = useState(0);
  const [months, setMonths] = useState(1);
  const [loadingStake, setLoadingStake] = useState(false);
  const [loadingUnstake, setLoadingUnstake] = useState(false);

  const handleMaxClick = () => {
    setAmount(Number(total.toFixed(PERCENT_DIGITS)));
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

  const disabledStake = !amount || amount > Number(total.toFixed(PERCENT_DIGITS));

  const xBRRR = shrinkToken(staking["staked_booster_amount"], TOKEN_DECIMALS);
  const booster = Number(shrinkToken(staking["x_booster_amount"], TOKEN_DECIMALS)).toLocaleString(
    undefined,
    TOKEN_FORMAT,
  );
  const stakingTimestamp = Number(staking["unlock_timestamp"]);
  const unstakeDate = DateTime.fromMillis(stakingTimestamp / 1e6);

  const disabledUnstake = DateTime.now() < unstakeDate;

  useEffect(() => {
    setMonths(Math.round(unstakeDate.diffNow().as("months")));
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
            value={amount}
            type="number"
            step="0.01"
            onClickMax={handleMaxClick}
            onChange={handleInputChange}
            onFocus={handleFocus}
          />
        </Stack>
        <Stack spacing={1}>
          <Typography>Number of months:</Typography>
          <Box px="0.5rem">
            <Slider value={months} onChange={handleSliderChange} />
          </Box>
        </Stack>
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

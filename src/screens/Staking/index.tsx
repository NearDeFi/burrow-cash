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
import Slider from "../../components/Slider/staking";

const Staking = () => {
  const accountId = useAppSelector(getAccountId);
  const [total] = useAppSelector(getTotalBRRR);
  const staking = useAppSelector(getStaking);
  const [amount, setAmount] = useState(0);
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleMaxClick = () => {
    setAmount(Number(total.toFixed(PERCENT_DIGITS)));
  };

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSliderChange = (e) => {
    setMonths(e.target.value);
  };

  const handleActionButtonClick = () => {
    stake({ amount, months });
    setLoading(true);
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const actionDisabled = amount === 0 || amount > Number(total.toFixed(PERCENT_DIGITS));

  const xBRRR = shrinkToken(staking["staked_booster_amount"], TOKEN_DECIMALS);
  const booster = Number(shrinkToken(staking["x_booster_amount"], TOKEN_DECIMALS)).toLocaleString(
    undefined,
    TOKEN_FORMAT,
  );
  const stakingTimestamp = Number(staking["unlock_timestamp"]);
  const unlockDate = DateTime.fromMillis(stakingTimestamp / 1e6);

  useEffect(() => {
    setMonths(Math.round(unlockDate.diffNow().as("months")));
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
          >
            <Typography component="span" mr="1rem" fontSize="0.875rem">
              Staked xBRRR: <b>{xBRRR}</b>
            </Typography>
            <Typography component="span" mr="1rem" fontSize="0.875rem">
              Booster: <b>{booster}</b>
            </Typography>
            <Typography component="div" fontSize="0.875rem" mt="0.5rem">
              Unlock date:{" "}
              <b>
                {stakingTimestamp
                  ? unlockDate.toFormat("dd / LLL / yyyy @ HH:mm")
                  : "-- / -- / ----"}
              </b>
            </Typography>
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
            disabled={actionDisabled}
            variant="contained"
            onClick={handleActionButtonClick}
            loading={loading}
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

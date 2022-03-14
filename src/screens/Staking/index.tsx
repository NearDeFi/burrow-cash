import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useAppSelector } from "../../redux/hooks";
import { getAccountId, getTotalBRRR } from "../../redux/accountSelectors";
import { TotalBRRR, Input } from "../../components";
import { NotConnected } from "../../components/Modal/components";
import { PERCENT_DIGITS } from "../../store";
import { stake } from "../../store/actions/stake";
import Slider from "../../components/Slider/staking";

const Staking = () => {
  const accountId = useAppSelector(getAccountId);
  const [total] = useAppSelector(getTotalBRRR);
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

  const actionDisabled = amount === 0 || amount > total;

  return (
    <Box mt="2rem">
      {accountId && <TotalBRRR showAction />}
      <Stack
        spacing={3}
        width={["100%", "580px"]}
        mx="auto"
        mb="2rem"
        bgcolor="#fff"
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

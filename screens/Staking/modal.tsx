import { useEffect, useState } from "react";
import { Modal, Stack, Box, Typography, Alert, useTheme } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { DateTime } from "luxon";
import pluralize from "pluralize";

import { Input } from "../../components";
import { CloseButton } from "../../components/Modal/components";
import { BrrrLogo, Separator } from "./components";
import { useAppSelector } from "../../redux/hooks";
import { getTotalBRRR } from "../../redux/selectors/getTotalBRRR";
import { stake } from "../../store/actions/stake";
import MonthSlider from "../../components/Slider/staking";
import Slider from "../../components/Slider";
import { trackMaxStaking, trackStaking } from "../../utils/telemetry";
import { useStaking } from "../../hooks/useStaking";
import { APY_FORMAT, TOKEN_FORMAT } from "../../store";
import { StakingRewards } from "./rewards";

export const StakingModal = ({ open, onClose }) => {
  const [total] = useAppSelector(getTotalBRRR);
  const [loadingStake, setLoadingStake] = useState(false);
  const {
    stakingTimestamp,
    amount,
    months,
    setAmount,
    setMonths,
    stakingNetAPY,
    stakingNetTvlAPY,
  } = useStaking();
  const unstakeDate = DateTime.fromMillis(stakingTimestamp / 1e6);
  const selectedMonths = stakingTimestamp ? Math.round(unstakeDate.diffNow().as("months")) : months;
  const theme = useTheme();

  const invalidAmount = amount > total;
  const invalidMonths = months < selectedMonths;
  const disabledStake = !amount || invalidAmount || invalidMonths;

  const inputAmount = `${amount}`
    .replace(/[^0-9.-]/g, "")
    .replace(/(?!^)-/g, "")
    .replace(/^0+(\d)/gm, "$1");

  const sliderValue = Math.round((amount * 100) / total) || 0;

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

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleStake = () => {
    trackStaking({ amount, months, percent: (amount / total) * 100 });
    stake({ amount, months });
    setLoadingStake(true);
    setAmount(0);
  };

  useEffect(() => {
    setMonths(selectedMonths);
  }, [stakingTimestamp]);

  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        direction="column"
        sx={{
          position: "relative",
          background: "white",
          mx: "auto",
          borderRadius: [0, "0.5rem"],
          height: ["100%", "80vh"],
          top: "calc(50% - 40vh)",
          maxHeight: "620px",
          maxWidth: 440,
          backgroundColor: "background.paper",
          "& *::-webkit-scrollbar": {
            backgroundColor: theme.custom.scrollbarBg,
          },
        }}
      >
        <Stack sx={{ overflowY: "auto", p: ["1.2rem", "2rem"] }} direction="column" spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BrrrLogo color="#594a42" width={40} height={40} />
            <Typography color={theme.custom.textStaking} fontWeight="semibold" fontSize="1.125rem">
              Stake BRRR
            </Typography>
            <CloseButton onClose={onClose} />
          </Stack>
          <Stack spacing={1}>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                color: "#909090",
                fontSize: "0.75rem",
                fontWeight: "medium",
              }}
            >
              <span>Amount</span>
              <span>Available: {total.toLocaleString(undefined, TOKEN_FORMAT)}</span>
            </Typography>
            <Input
              value={inputAmount}
              type="number"
              step="0.01"
              onClickMax={handleMaxClick}
              onChange={handleInputChange}
              onFocus={handleFocus}
            />
            <Box px="1.5rem" my="1rem">
              <Slider value={sliderValue} onChange={handleSliderChange} />
            </Box>
          </Stack>
          <Stack spacing={1}>
            <Typography
              sx={{
                color: "#909090",
                fontSize: "0.75rem",
                fontWeight: "medium",
              }}
            >
              Duration
            </Typography>
            <Input
              value={pluralize("month", months, true)}
              readOnly
              onClickMax={() => setMonths(12)}
            />
            <Box px="1.5rem" my="1rem">
              <MonthSlider value={months} onChange={handleMonthSliderChange} />
            </Box>
          </Stack>
          <Stack
            spacing={1}
            sx={{
              borderRadius: 1,
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
              fontWeight: "medium",
              p: "1.5rem",
              px: "1.2rem",
              backgroundColor: theme.custom.backgroundStaking,
            }}
          >
            <Typography
              sx={{
                color: theme.custom.textStaking,
                fontSize: "1rem",
              }}
            >
              Reward details
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography color="#909090" fontWeight={500} fontSize="0.75rem">
                Pools APY
              </Typography>
              <Separator />
              <Typography
                color="#46C285"
                fontWeight={700}
                fontSize="0.75rem"
                bgcolor="rgba(71, 200, 128, 0.24)"
                borderRadius={1}
                px="8px"
                py="4px"
              >
                {stakingNetAPY.toLocaleString(undefined, APY_FORMAT)}%
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography color="#909090" fontWeight={500} fontSize="0.75rem">
                Net Liquidity APY
              </Typography>
              <Separator />
              <Typography
                color="#46C285"
                fontWeight={700}
                fontSize="0.75rem"
                bgcolor="rgba(71, 200, 128, 0.24)"
                borderRadius={1}
                px="8px"
                py="4px"
              >
                {stakingNetTvlAPY.toLocaleString(undefined, APY_FORMAT)}%
              </Typography>
            </Box>
            <StakingRewards />
          </Stack>
          <Stack spacing={1}>
            {invalidAmount && (
              <Alert severity="error">Amount must be lower than total BRRR earned</Alert>
            )}
            {invalidMonths && (
              <Alert severity="error">
                The new staking duration is shorter than the current remaining staking duration
              </Alert>
            )}
          </Stack>
          <LoadingButton
            disabled={disabledStake}
            variant="contained"
            onClick={handleStake}
            loading={loadingStake}
          >
            Confirm
          </LoadingButton>
          <Box bgcolor="#fff8ba" py={1} borderRadius="4px" width="80%" alignSelf="center">
            <Typography fontSize="0.625rem" textAlign="center" color="#404040" fontWeight="medium">
              Staking duration applies to previously staked BRRR as well.
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Modal>
  );
};

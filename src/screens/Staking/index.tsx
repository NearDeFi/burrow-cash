import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Alert,
  Grid,
  useTheme,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DateTime } from "luxon";

import { APY_FORMAT, NUMBER_FORMAT, TOKEN_FORMAT } from "../../store/constants";
import { useAppSelector } from "../../redux/hooks";
import { getTotalBRRR } from "../../redux/selectors/getTotalBRRR";
import { TotalBRRR, Input } from "../../components";
import { stake } from "../../store/actions/stake";
import { unstake } from "../../store/actions/unstake";
import MonthSlider from "../../components/Slider/staking";
import Slider from "../../components/Slider";
import { trackMaxStaking, trackStaking, trackUnstake } from "../../telemetry";
import { useAccountId } from "../../hooks/hooks";
import { useStaking } from "../../hooks/useStaking";
import { useUserHealth } from "../../hooks/useUserHealth";
import { StakingRewards } from "./rewards";
import { RewardsDetailed } from "./rewards-detailed";

const Staking = () => {
  const accountId = useAccountId();
  const [total] = useAppSelector(getTotalBRRR);
  const [amount, setAmount] = useState(0);
  const [months, setMonths] = useState(1);
  const [loadingStake, setLoadingStake] = useState(false);
  const [loadingUnstake, setLoadingUnstake] = useState(false);
  const { BRRR, xBRRR, staking, config } = useStaking();
  const { netAPY } = useUserHealth();
  const theme = useTheme();

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

  const xBRRRMultiplier =
    1 +
    ((months * config.minimum_staking_duration_sec - config.minimum_staking_duration_sec) /
      (config.maximum_staking_duration_sec - config.minimum_staking_duration_sec)) *
      (config.x_booster_multiplier_at_maximum_staking_duration / 10000 - 1);

  const extraXBRRRAmount = amount * xBRRRMultiplier;

  const sliderValue = Math.round((amount * 100) / total) || 0;

  useEffect(() => {
    setMonths(selectedMonths);
  }, [staking]);

  return (
    <Box mt="2rem" px={["0rem", "2rem"]} maxWidth={["auto", 700]} mx="auto">
      {accountId && (
        <>
          <TotalBRRR />
          <Box
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
                Staked BRRR: <b>{BRRR.toLocaleString(undefined, TOKEN_FORMAT)}</b>
              </Typography>
              <Typography component="span" mr="1rem" fontSize="0.875rem">
                xBRRR: <b>{xBRRR.toLocaleString(undefined, TOKEN_FORMAT)}</b>
              </Typography>
              <Typography component="div" fontSize="0.875rem" mt="0.5rem">
                Unstake date:{" "}
                <b>
                  {stakingTimestamp
                    ? unstakeDate.toFormat("yyyy-MM-dd @ HH:mm")
                    : "___-__-__ @ --:--"}
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
        mx="auto"
        mb="2rem"
        py={["1.5rem", "0.75rem"]}
        justifyContent="space-between"
        position="relative"
      >
        <Stack gap={[2, 4]} direction={["column", "row"]} alignItems="flex-end">
          <Stack spacing={1} px={[2, 0]} width={["100%", "40%"]} maxWidth={["100%", "50%"]}>
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
          </Stack>
          <Stack spacing={1} px={[2, 0]} width="100%" maxWidth={["100%", "50%"]}>
            <Typography>Number of months to stake:</Typography>
            <Box px="0.5rem">
              <MonthSlider value={months} onChange={handleMonthSliderChange} />
            </Box>
          </Stack>
        </Stack>
        {invalidAmount && (
          <Alert severity="error">Amount must be lower than total BRRR earned</Alert>
        )}
        {invalidMonths && (
          <Alert severity="error">
            The new staking duration is shorter than the current remaining staking duration
          </Alert>
        )}

        <Stack>
          <Alert severity="info">
            <Stack direction={["column", "row"]} alignItems="center">
              <Typography fontSize="0.85rem">Not enough BRRR? Simulate a staking with:</Typography>
              <Stack direction="row">
                {[100, 1000, 10000, 100000].map((a) => (
                  <Button key={a} size="small" onClick={() => setAmount(a)} sx={{ p: 0 }}>
                    {a.toLocaleString(undefined, NUMBER_FORMAT)}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Alert>
        </Stack>

        <Paper sx={{ backgroundColor: "#e5f7fd" }}>
          <Stack p="1rem">
            <Grid container spacing={1} columns={2} px={[1, 2]}>
              <Grid item xs={1}>
                <Typography fontSize="0.75rem">xBRRR to receive:</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography fontSize="0.75rem" textAlign="right">
                  {extraXBRRRAmount.toLocaleString(undefined, TOKEN_FORMAT)}
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography fontSize="0.75rem">Total xBRRR after staking:</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography fontSize="0.75rem" textAlign="right">
                  {(xBRRR + extraXBRRRAmount).toLocaleString(undefined, TOKEN_FORMAT)}
                </Typography>
              </Grid>
            </Grid>
            <Box
              component="hr"
              sx={{
                borderWidth: 0.5,
                bgcolor: theme.palette.background.default,
                borderStyle: "outset",
              }}
            />

            <Box display="grid" gridTemplateColumns="1fr auto " px={[1, 2]} p={1.5} bgcolor="white">
              <Typography fontSize="0.85rem">Net APY</Typography>
              <Typography fontSize="0.85rem">
                {netAPY.toLocaleString(undefined, APY_FORMAT)}%
              </Typography>
              <Typography fontSize="0.85rem">Boosted Net APY 🚀</Typography>
              <Typography fontSize="0.85rem" fontWeight="bold">
                {netAPY.toLocaleString(undefined, APY_FORMAT)}%
              </Typography>
            </Box>

            <StakingRewards amount={xBRRR + extraXBRRRAmount} />
            <Accordion sx={{ boxShadow: "none" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="reward-details"
                id="reward-details"
              >
                <Typography fontSize="0.85rem">Staking Rewards Detailed</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RewardsDetailed amount={xBRRR + extraXBRRRAmount} type="supplied" />
                <RewardsDetailed amount={xBRRR + extraXBRRRAmount} type="borrowed" />
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Paper>
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

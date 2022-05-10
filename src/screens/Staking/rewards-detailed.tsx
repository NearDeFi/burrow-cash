import { Box, Stack, Typography, useTheme } from "@mui/material";

import { USD_FORMAT } from "../../store/constants";
import TokenIcon from "../../components/TokenIcon";
import APYCell from "../../components/Table/common/apy-cell";
import { Rewards } from "../../components";
import { useStakingRewards } from "../../hooks";
import { Info } from "./rewards";

interface Props {
  amount: number;
  type: "supplied" | "borrowed";
}

export const RewardsDetailed = ({ amount, type }: Props) => {
  const stakingRewards = useStakingRewards(amount);
  const theme = useTheme();
  const isSupplied = type === "supplied";
  const rewards = stakingRewards[type];
  const displayOnSupplied = isSupplied ? "inherit" : "none";
  const title = isSupplied ? "Deposited Rewards" : "Borrowed Rewards";

  if (!rewards.length) return null;

  return (
    <Stack direction={["column", "row"]} width="100%" gap={[2, 0]} pt={[2, 0]}>
      <Box
        display="grid"
        gridTemplateColumns="1fr auto 1fr"
        alignItems="center"
        p={[0, 1]}
        pr={[0, 0]}
        width={["100%", "100%"]}
      >
        <Typography fontSize="0.75rem" textAlign="left" fontWeight="bold">
          {title}
        </Typography>
        <Typography
          display={displayOnSupplied}
          fontSize="0.75rem"
          textAlign="right"
          fontWeight="bold"
        >
          APY
        </Typography>
        <Typography
          display={displayOnSupplied}
          fontSize="0.75rem"
          textAlign="right"
          fontWeight="bold"
          pr={[0, 1]}
        >
          Daily
        </Typography>
        {rewards.map((token) => {
          const apyRewards = isSupplied ? token.depositRewards : token.borrowRewards;
          const baseAPY = isSupplied ? token.apy : token.borrowApy;
          const page = isSupplied ? "deposit" : "borrow";
          return (
            <>
              <Box
                key={`${token.tokenId}-0`}
                gridColumn="1 / span 3"
                component="hr"
                sx={{
                  width: "100%",
                  borderWidth: 0.5,
                  bgcolor: theme.palette.background.default,
                  borderStyle: "outset",
                }}
              />
              <Box key={`${token.tokenId}-1`} display="flex" alignItems="center" minHeight={42}>
                <TokenIcon icon={token.icon} width={30} height={30} />
                <Box px="0.5rem">
                  <Typography fontSize="0.7rem">{token.symbol}</Typography>
                  <Typography fontSize="0.7rem">
                    {token.price?.toLocaleString(undefined, USD_FORMAT) || "$-.-"}
                  </Typography>
                </Box>
              </Box>
              <Box key={`${token.tokenId}-2`}>
                <APYCell
                  rewards={apyRewards}
                  baseAPY={baseAPY}
                  totalSupplyMoney={token.totalSupplyMoney}
                  page={page}
                  tokenId={token.tokenId}
                  showIcons={false}
                  sx={{ fontWeight: "normal", fontSize: "0.75rem" }}
                />
              </Box>
              <Box key={`${token.tokenId}-3`} pr={[0, 1]}>
                <Rewards rewards={token.rewards} layout="vertical" />
              </Box>
            </>
          );
        })}
      </Box>
      <BoostedRewards amount={amount} type={type} />
    </Stack>
  );
};

const BoostedRewards = ({ amount, type }: Props) => {
  const stakingRewards = useStakingRewards(amount);
  const theme = useTheme();
  const isSupplied = type === "supplied";
  const rewards = stakingRewards[type];
  const boosted = stakingRewards.boosted[type];

  if (!rewards.length) return null;

  return (
    <Box
      display="grid"
      gridTemplateColumns={["1fr auto 1fr", "auto"]}
      alignItems="center"
      bgcolor="#d7f0e5"
      p={1}
      pl={[2, 0]}
      pr={[2, 1]}
      width={["108%", "60%"]}
      ml={[-2, 0]}
    >
      <Typography
        gridColumn={["2 / span 1", "1 / span 1"]}
        fontSize="0.75rem"
        textAlign="right"
        fontWeight="bold"
      >
        {isSupplied ? (
          <span>
            🚀 APY <Info title="Boosted APY for each asset after staking" />
          </span>
        ) : (
          <span>&nbsp;</span>
        )}
      </Typography>
      <Typography
        gridColumn={["3 / span 1", "2 / span 1"]}
        fontSize="0.75rem"
        textAlign="right"
        fontWeight="bold"
        display={[!isSupplied ? "none" : "inherit", "inherit"]}
      >
        {isSupplied ? (
          <span>
            🚀 Daily <Info title="Boosted daily rewards for each asset after staking" />
          </span>
        ) : (
          <span>&nbsp;</span>
        )}
      </Typography>
      {boosted.map((token) => {
        const apyRewards = isSupplied ? token.depositRewards : token.borrowRewards;
        const baseAPY = isSupplied ? token.apy : token.borrowApy;
        const page = isSupplied ? "deposit" : "borrow";
        return (
          <>
            <Box
              key={`${token.tokenId}-hr`}
              gridColumn={["1 / span 3", "1 / span 2"]}
              component="hr"
              sx={{
                width: "100%",
                borderWidth: 0.5,
                bgcolor: theme.palette.background.default,
                borderStyle: "outset",
              }}
            />
            <Box key={`${token.tokenId}-token`} display={["flex", "none"]} alignItems="center">
              <TokenIcon icon={token.icon} width={30} height={30} />
              <Box px="0.5rem">
                <Typography fontSize="0.7rem">{token.symbol}</Typography>
                <Typography fontSize="0.7rem">
                  {token.price?.toLocaleString(undefined, USD_FORMAT) || "$-.-"}
                </Typography>
              </Box>
            </Box>
            <Box key={`${token.tokenId}-apy`}>
              <APYCell
                rewards={apyRewards}
                baseAPY={baseAPY}
                totalSupplyMoney={token.totalSupplyMoney}
                page={page}
                tokenId={token.tokenId}
                showIcons={false}
                sx={{ fontSize: "0.75rem" }}
              />
            </Box>
            <Box key={`${token.tokenId}-rewards`} minHeight={42} alignItems="center" display="grid">
              <Rewards rewards={token.rewards} layout="vertical" fontWeight="bold" />
            </Box>
          </>
        );
      })}
    </Box>
  );
};

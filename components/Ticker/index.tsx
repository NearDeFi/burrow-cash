import { Box, Stack, Link, useTheme } from "@mui/material";
import TimeAgo from "timeago-react";
import { motion } from "framer-motion";

import { getFeedEvents } from "../../redux/feedSelectors";
import { shrinkToken } from "../../store/helper";
import { TOKEN_FORMAT } from "../../store/constants";
import { getAssets } from "../../redux/assetsSelectors";
import { useAppSelector } from "../../redux/hooks";
import TokenIcon from "../TokenIcon";
import FeedData from "./feed";
import { accountTrim } from "../../utils";

const Ticker = () => {
  const events = useAppSelector(getFeedEvents);
  const assets = useAppSelector(getAssets);
  const theme = useTheme();

  return (
    <Box width="100%" overflow="hidden" sx={{ backgroundColor: theme.palette.primary.light }}>
      <Stack
        m={0}
        spacing={2}
        direction="row"
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        initial={{ x: "100vw" }}
        animate={{ x: -10000 }}
        component={motion.ul}
        fontSize="0.85rem"
      >
        {events.map((e) => {
          const asset = assets.data[e.data.tokenId];
          if (!asset) return null;
          const decimals = asset.metadata.decimals + asset.config.extra_decimals;
          const amount = Number(shrinkToken(e.data.amount, decimals)).toLocaleString(
            undefined,
            TOKEN_FORMAT,
          );

          return (
            <Stack key={e.receiptId} spacing={1} py="0.5rem" direction="row" justifyItems="center">
              <Box minWidth={120} textAlign="right">
                <TimeAgo datetime={new Date(e.timestamp / 1e6)} />
              </Box>
              <Link
                href={`https://app.burrow.cash?viewAs=${e.data.accountId}`}
                target="blank"
                fontWeight="bold"
                whiteSpace="nowrap"
              >
                {accountTrim(e.data.accountId)}
              </Link>
              <Box>{e.event}</Box>
              <TokenIcon width={18} height={18} icon={asset.metadata.icon} />
              <Box>{amount}</Box>
            </Stack>
          );
        })}
      </Stack>
      <FeedData />
    </Box>
  );
};

export default Ticker;

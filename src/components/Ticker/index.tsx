import { Box, Stack, Link } from "@mui/material";
import TimeAgo from "timeago-react";

import { getFeedEvents } from "../../redux/feedSelectors";
import { shrinkToken } from "../../store/helper";
import { TOKEN_FORMAT } from "../../store/constants";
import { getAssets } from "../../redux/assetsSelectors";
import { useAppSelector } from "../../redux/hooks";
import TokenIcon from "../TokenIcon";
import FeedData from "./feed";
import "./styles.css";

const Ticker = () => {
  const events = useAppSelector(getFeedEvents);
  const assets = useAppSelector(getAssets);

  return (
    <Box className="ticker">
      <Stack className="ticker-list" spacing={2} direction="row">
        {events.map((e) => {
          const asset = assets[e.data.tokenId];
          const decimals = asset.metadata.decimals + asset.config.extra_decimals;
          const amount = Number(shrinkToken(e.data.amount, decimals)).toLocaleString(
            undefined,
            TOKEN_FORMAT,
          );

          return (
            <Stack key={e.receiptId} spacing={1} py="0.5rem" direction="row">
              <TimeAgo className="time-ago" datetime={new Date(e.timestamp / 1e6)} />
              <Link
                href={`https://app.burrow.cash?viewAs=${e.data.accountId}`}
                target="blank"
                fontWeight="bold"
              >
                {e.data.accountId}
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

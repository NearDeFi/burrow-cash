import { Box, Stack, Link } from "@mui/material";
import TimeAgo from "timeago-react";

import { getFeedEvents } from "../../redux/feedSelectors";
import { getAssets } from "../../redux/assetsSelectors";
import { useAppSelector } from "../../redux/hooks";
import FeedData from "./feed";
import "./styles.css";

const Ticker = () => {
  const events = useAppSelector(getFeedEvents);
  const assets = useAppSelector(getAssets);
  console.log(assets);

  return (
    <Box className="ticker">
      <Stack className="ticker-list" spacing={2} direction="row">
        {events.map((e) => (
          <Stack key={e.receiptId} spacing={2} py="0.5rem" direction="row">
            <Link
              href={`https://app.burrow.cash?viewAs=${e.data.accountId}`}
              target="blank"
              fontWeight="bold"
            >
              {e.data.accountId}
            </Link>
            <TimeAgo className="time-ago" datetime={new Date(e.timestamp / 1e6)} />
            <Box>{e.event}</Box>
          </Stack>
        ))}
      </Stack>
      <FeedData />
    </Box>
  );
};

export default Ticker;

import { Box, Skeleton } from "@mui/material";

import { USD_FORMAT } from "../../../store/constants";
import { BRRRPrice } from "../../index";
import { useIsBurrowToken } from "../../../hooks";
import TokenIcon from "../../TokenIcon";

const TokenCell = ({ rowData }) => {
  const isBurrowToken = useIsBurrowToken(rowData.tokenId);

  return (
    <Box display="flex" alignItems="center">
      <Box>
        {rowData ? (
          <TokenIcon icon={rowData?.icon} />
        ) : (
          <Skeleton sx={{ bgcolor: "gray" }} width={35} height={35} variant="circular" />
        )}
      </Box>
      <Box px="1rem">
        {rowData ? (
          <>
            <Box>{rowData.symbol}</Box>
            {isBurrowToken && !rowData.price ? (
              <BRRRPrice />
            ) : (
              <Box>
                {rowData.price ? rowData.price.toLocaleString(undefined, USD_FORMAT) : "$-.-"}
              </Box>
            )}
          </>
        ) : (
          <>
            <Skeleton sx={{ bgcolor: "gray" }} width={40} height={20} />
            <Skeleton sx={{ bgcolor: "gray" }} width={50} height={20} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default TokenCell;

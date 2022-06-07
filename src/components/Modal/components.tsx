import { Box, Typography, Stack, Alert, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import TokenIcon from "../TokenIcon";
import { actionMapTitle } from "./utils";
import APYCell from "../Table/common/apy-cell";
import { TOKEN_FORMAT } from "../../store";

export const USNInfo = () => (
  <Box mt="1rem">
    <Alert severity="info">
      <Stack>
        <Box>
          To swap NEAR for USN, use &nbsp;
          <Link
            href="https://swap.decentral-bank.finance/"
            title="DecentralBank SWAP"
            target="blank"
          >
            DecentralBank SWAP
          </Link>
        </Box>
      </Stack>
    </Alert>
  </Box>
);

export const NotConnected = () => (
  <Box
    position="absolute"
    display="flex"
    justifyContent="center"
    alignItems="center"
    top="0"
    left="0"
    right="0"
    bottom="0"
    bgcolor="rgba(255,255,255,0.85)"
    zIndex="1"
  >
    <Typography variant="h5" bgcolor="#fff">
      Please connect your wallet
    </Typography>
  </Box>
);

export const CloseButton = ({ onClose, ...props }) => (
  <Box
    onClick={onClose}
    position="absolute"
    right="2rem"
    zIndex="2"
    sx={{ cursor: "pointer" }}
    {...props}
  >
    <CloseIcon fontSize="small" />
  </Box>
);

export const TokenInfo = ({ apy, asset }) => {
  const { action, symbol, tokenId, icon, depositRewards, borrowRewards, price } = asset;
  const page = ["Withdraw", "Adjust", "Supply"].includes(action) ? "deposit" : "borrow";
  const apyRewards = page === "deposit" ? depositRewards : borrowRewards;

  return (
    <>
      <Typography textAlign="left" fontWeight="500" fontSize="1.3rem">
        {actionMapTitle[action]}
      </Typography>
      <Box
        boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
        borderRadius={1}
        mt="2rem"
        p={2}
        display="flex"
      >
        <TokenIcon icon={icon} />
        <Box ml="12px">
          <Typography fontSize="0.85rem" fontWeight="500" color="grey.800">
            {symbol}
          </Typography>
          <Typography fontSize="0.7rem" color="grey.700">
            ${price}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            height: "24px",
            bgcolor: "rgba(71, 200, 128, 0.24)",
            alignItems: "center",
            borderRadius: "4px",
            px: "8px",
            ml: "auto",
            alignSelf: "center",
          }}
        >
          <APYCell
            rewards={apyRewards}
            baseAPY={apy}
            page={page}
            tokenId={tokenId}
            showIcons={false}
            justifyContent="center"
            sx={{
              fontSize: "0.75rem",
              color: "#47C880",
              minWidth: "auto",
              mr: "4px",
            }}
          />
          <Typography sx={{ fontSize: "0.75rem", color: "#47C880", fontWeight: "bold" }}>
            APY
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export const Available = ({ totalAvailable, available$ }) => (
  <Box mt="1rem" mb="0.5rem" display="flex" justifyContent="flex-end">
    <Typography fontSize="0.75rem" color="grey.500">
      Available: {Number(totalAvailable).toLocaleString(undefined, TOKEN_FORMAT)} ({available$})
    </Typography>
  </Box>
);

export const HealthFactor = ({ value }) => {
  const healthFactorColor =
    value === -1 ? "black" : value < 180 ? "red" : value < 200 ? "orange" : "green";
  const healthFactorDisplayValue = value === -1 ? "N/A" : `${value?.toFixed(2)}%`;

  return (
    <Box display="flex" justifyContent="space-between">
      <Typography color="gray" fontSize="0.85rem">
        Health Factor
      </Typography>
      <Typography fontSize="0.85rem" color={healthFactorColor}>
        {healthFactorDisplayValue}
      </Typography>
    </Box>
  );
};

export const Rates = ({ rates }) => {
  if (!rates) return null;
  return rates.map(({ label, value }) => (
    <Box key={label} display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1" fontSize="0.85rem" color="gray">
        {label}
      </Typography>
      <Typography variant="body1" fontSize="0.85rem" fontWeight="500" color="gray">
        {value}
      </Typography>
    </Box>
  ));
};

export const Alerts = ({ data }) => (
  <Stack my="1rem" spacing="1rem">
    {Object.keys(data).map((alert) => (
      <Alert key={alert} severity={data[alert].severity}>
        {data[alert].title}
      </Alert>
    ))}
  </Stack>
);

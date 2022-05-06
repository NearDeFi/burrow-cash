import { Box, Typography, Stack, Alert, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import TokenIcon from "../TokenIcon";
import { actionMapTitle } from "./utils";
import { APY_FORMAT } from "../../store";

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
    right="1rem"
    zIndex="2"
    sx={{ cursor: "pointer" }}
    {...props}
  >
    <CloseIcon fontSize="small" />
  </Box>
);

export const TokenInfo = ({ action, apy, icon, name }) => (
  <>
    <Typography textAlign="center" fontWeight="500" fontSize="1.5rem">
      {actionMapTitle[action]}
    </Typography>
    <Box display="grid" justifyContent="center" mt="2rem">
      <TokenIcon icon={icon} />
    </Box>
    <Typography textAlign="center" fontSize="0.85rem" fontWeight="500" mt="1rem">
      {name}
      <br />
      <span>{apy?.toLocaleString(undefined, APY_FORMAT)}%</span>
    </Typography>
  </>
);

export const Available = ({ totalAvailable, displaySymbol, available$, price }) => (
  <Box mt="1rem" mb="0.5rem" display="flex" justifyContent="space-between">
    <Typography variant="body1" fontSize="0.85rem" fontWeight="500">
      Available: {totalAvailable} {displaySymbol} ({available$})
    </Typography>
    <Typography variant="body1" fontSize="0.85rem" fontWeight="500">
      1 {displaySymbol} = ${price}
    </Typography>
  </Box>
);

export const HealthFactor = ({ value }) => {
  const healthFactorColor =
    value === -1 ? "black" : value < 180 ? "red" : value < 200 ? "orange" : "green";
  const healthFactorDisplayValue = value === -1 ? "N/A" : `${value?.toFixed(2)}%`;

  return (
    <Box
      fontSize="1rem"
      fontWeight="500"
      border="1px solid black"
      p="0.5rem"
      m="0.5rem"
      width="15rem"
      margin="0 auto"
      display="flex"
      justifyContent="center"
    >
      <span>Health Factor:</span>
      <Box ml={1} color={healthFactorColor}>
        {healthFactorDisplayValue}
      </Box>
    </Box>
  );
};

export const Rates = ({ action, rates }) => {
  if (!rates) return null;
  return (
    <Box>
      <Typography fontSize="0.85rem" fontWeight="bold">
        {actionMapTitle[action]} Rates
      </Typography>
      {rates.map(({ label, value }) => (
        <Box
          mt="0.5rem"
          key={label}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body1" fontSize="0.85rem">
            {label}
          </Typography>
          <Typography variant="body1" fontSize="0.85rem" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
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

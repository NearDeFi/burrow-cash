import { useState, useEffect, useRef } from "react";
import { Button, Box, Stack, IconButton, useTheme, useMediaQuery, Typography } from "@mui/material";
import { FaUserAlt } from "@react-icons/all-files/fa/FaUserAlt";

import NearWalletSelector from "@near-wallet-selector/core";
import { fetchAssets, fetchRefPrices } from "../../redux/assetsSlice";
import { logoutAccount, fetchAccount } from "../../redux/accountSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getBurrow, accountTrim } from "../../utils";

import { hideModal as _hideModal } from "../../redux/appSlice";

import { getAccountBalance, getAccountId } from "../../redux/accountSelectors";
import { trackConnectWallet } from "../../telemetry";
import { useDegenMode } from "../../hooks/hooks";
import NearIcon from "../../assets/near-icon.svg";
import { UserMenu } from "./Menu";

const WalletButton = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const balance = useAppSelector(getAccountBalance);
  const accountId = useAppSelector(getAccountId);
  const { degenMode } = useDegenMode();

  const selectorRef = useRef<NearWalletSelector>();
  const [selector, setSelector] = useState<NearWalletSelector | null>(null);

  const hideModal = () => {
    dispatch(_hideModal());
  };

  const fetchData = () => {
    dispatch(fetchAssets()).then(() => dispatch(fetchRefPrices()));
    dispatch(fetchAccount());
  };

  const signOut = () => {
    dispatch(logoutAccount());
  };

  const onMount = async () => {
    if (selector) return;
    const { selector: s } = await getBurrow({ fetchData, hideModal, signOut });
    selectorRef.current = s;
    setSelector(s);
  };
  useEffect(() => {
    onMount();
  }, []);

  const onWalletButtonClick = async () => {
    if (accountId) return;
    trackConnectWallet();
    selector?.show();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      sx={{
        gridArea: "wallet",
        marginLeft: "auto",
        marginRight: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      {accountId ? (
        <Box
          sx={{
            fontSize: "0.8rem",
            display: ["none", "flex"],
            flexFlow: isMobile ? "column" : "row",
            alignItems: ["flex-end", "center"],
          }}
        >
          <Typography sx={{ fontWeight: "semibold", fontSize: "0.85rem" }}>
            {accountTrim(accountId)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginLeft: 1,
              alignItems: "center",
            }}
          >
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                bgcolor: "rgba(172, 255, 255, 0.1)",
                borderRadius: "4px",
                pl: 1,
                pr: 0.3,
              }}
            >
              <Typography
                sx={{ lineHeight: 0, fontSize: "0.85rem", color: "rgba(172, 255, 209, 1)" }}
              >
                {Number.parseFloat(balance).toFixed(2)}
              </Typography>
              <NearIcon style={{ width: "1.5rem", height: "1.5rem", fill: "white" }} />
            </Stack>
            {degenMode.enabled && (
              <Box
                sx={{
                  ml: 1,
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.secondary.main,
                  borderRadius: "0.3rem",
                  fontSize: "0.65rem",
                  px: "0.3rem",
                  py: "0.1rem",
                }}
              >
                degen
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Button
          size="small"
          sx={{
            justifySelf: "end",
            alignItems: "center",
            cursor: accountId ? "default" : "pointer",
          }}
          variant={accountId ? "outlined" : "contained"}
          onClick={onWalletButtonClick}
          disableRipple={!!accountId}
        >
          Connect Wallet
        </Button>
      )}
      <Box>
        <IconButton onClick={handleOpenMenu} sx={{ ml: "0.2rem", mr: "-0.5rem" }}>
          <FaUserAlt size={18} color="white" />
        </IconButton>
      </Box>
      <UserMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} selector={selector} />
    </Box>
  );
};

export default WalletButton;

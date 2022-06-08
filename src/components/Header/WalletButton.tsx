import { useState, useEffect, useRef } from "react";
import { Button, Box, IconButton, useTheme, useMediaQuery, Typography } from "@mui/material";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";

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
import { HamburgerMenu } from "./Menu";

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
            display: "flex",
            flexFlow: isMobile ? "column" : "row",
            alignItems: ["flex-end", "center"],
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "0.85rem" }}>
            {accountTrim(accountId)}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginLeft: 1,
              alignItems: "center",
              mt: ["-0.3rem", 0],
            }}
          >
            <Typography sx={{ lineHeight: 0, fontSize: "0.85rem" }}>
              {Number.parseFloat(balance).toFixed(2)}
            </Typography>
            <NearIcon style={{ width: "1.5rem", height: "1.5rem" }} />
            {degenMode.enabled && (
              <Box
                sx={{
                  marginRight: "-6px",
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.main,
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
        <IconButton onClick={handleOpenMenu} sx={{ ml: "0.5rem", mr: "-0.5rem" }}>
          <GiHamburgerMenu size={32} color={theme.palette.primary.main} />
        </IconButton>
      </Box>
      <HamburgerMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} selector={selector} />
    </Box>
  );
};

export default WalletButton;

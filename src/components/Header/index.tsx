import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme, useMediaQuery, Box, Snackbar, Alert } from "@mui/material";

import BackgroundDesktop from "./bg-desktop.svg";
import BackgroundMobile from "./bg-mobile.svg";
import LogoIcon from "../../assets/logo.svg";
import { Wrapper, Logo, Menu, LinkStyled } from "./style";
import WalletButton from "./WalletButton";
import { useAppSelector } from "../../redux/hooks";
import { isAssetsFetching } from "../../redux/assetsSelectors";
import { isTestnet } from "../../utils";
import { useViewAs } from "../../hooks";

const MenuItem = ({ title, pathname }) => {
  const location = useLocation();
  const theme = useTheme();
  const isSelected = location.pathname === pathname;

  const style = isSelected ? { borderBottomColor: theme.palette.primary.main } : {};

  return (
    <LinkStyled to={pathname + location.search} sx={style}>
      {title}
    </LinkStyled>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const isFetching = useAppSelector(isAssetsFetching);
  const matches = useMediaQuery("(min-width:1200px)");
  const isViewingAs = useViewAs();

  useEffect(() => {
    if (isFetching) {
      setOpen(true);
    }
  }, [isFetching]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const Background = !matches ? (
    <BackgroundMobile width="100%" />
  ) : (
    <BackgroundDesktop width="100%" />
  );

  return (
    <Wrapper style={{ position: "relative" }}>
      {isViewingAs && (
        <Box
          position="absolute"
          left="calc(50% - 75px)"
          width="150px"
          fontWeight="bold"
          color="#47C880"
          textAlign="center"
          top={["0rem", "3.5rem", "1rem"]}
          zIndex="1"
          py={1}
          sx={{ backgroundColor: "#EBFFF4" }}
        >
          Read Only Mode
        </Box>
      )}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "-10px",
          zIndex: "-1",
          pointerEvents: "none",
        }}
      >
        {Background}
      </Box>
      <Logo>
        <LogoIcon />
      </Logo>
      <Menu>
        <MenuItem title="Deposit" pathname="/deposit" />
        <MenuItem title="Borrow" pathname="/borrow" />
        <MenuItem title="Portfolio" pathname="/portfolio" />
        {isTestnet && <MenuItem title="Staking" pathname="/staking" />}
      </Menu>
      <WalletButton />
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info">Refreshing assets data...</Alert>
      </Snackbar>
    </Wrapper>
  );
};

export default Header;

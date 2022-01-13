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

const MenuItem = ({ title, pathname }) => {
  const location = useLocation();
  const theme = useTheme();
  const isSelected = location.pathname === pathname;

  const style = isSelected ? { borderBottomColor: theme.palette.primary.main } : {};

  return (
    <LinkStyled to={pathname} sx={style}>
      {title}
    </LinkStyled>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const isFetching = useAppSelector(isAssetsFetching);
  const matches = useMediaQuery("(min-width:1200px)");

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
      </Menu>
      <WalletButton />
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info">Refreshing assets pricing...</Alert>
      </Snackbar>
    </Wrapper>
  );
};

export default Header;

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTheme, Box, Snackbar, Alert, IconButton } from "@mui/material";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";

import FullLogoIcon from "../../assets/logo.svg";
import LogoIcon from "../../assets/logo-icon.svg";
import { Wrapper, Menu, LinkStyled } from "./style";
import WalletButton from "./WalletButton";
import { useAppSelector } from "../../redux/hooks";
import { isAssetsFetching } from "../../redux/assetsSelectors";
import { useViewAs } from "../../hooks/hooks";
import { Stats } from "./stats";

const MenuItem = ({ title, pathname, sx = {} }) => {
  const location = useLocation();
  const theme = useTheme();
  const isSelected = location.pathname === pathname;

  const style = isSelected ? { borderBottomColor: theme.palette.primary.main, opacity: 1 } : {};

  return (
    <LinkStyled to={pathname + location.search} sx={{ ...style, ...sx }}>
      {title}
    </LinkStyled>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const isFetching = useAppSelector(isAssetsFetching);
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

  const handleOpenMenu = () => {
    console.info("handleOpenMenu");
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #000741 0%, #226062 100%)",
        mb: { xs: "1rem", sm: "2rem" },
        overflow: "hidden",
      }}
    >
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
        <Box sx={{ display: { sx: "inherit", sm: "none" }, ml: "-0.5rem" }}>
          <IconButton onClick={handleOpenMenu} sx={{ ml: "0.2rem", mr: "-0.5rem" }}>
            <GiHamburgerMenu size={18} color="white" />
          </IconButton>
        </Box>
        <Box sx={{ gridArea: "logo", display: { xs: "none", sm: "block" } }}>
          <FullLogoIcon style={{ fill: "white" }} />
        </Box>
        <Box
          sx={{
            pt: 1,
            gridArea: "logo",
            justifySelf: "center",
            display: { xs: "block", sm: "none" },
          }}
        >
          <LogoIcon />
        </Box>
        <Menu>
          <MenuItem title="Deposit" pathname="/deposit" />
          <MenuItem title="Borrow" pathname="/borrow" />
          <MenuItem title="Portfolio" pathname="/portfolio" />
          <MenuItem title="Staking" pathname="/staking" />
          <MenuItem
            title="Bridge"
            pathname="/bridge"
            sx={{ color: "#47C880", fontWeight: "bold" }}
          />
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
      <Stats />
    </Box>
  );
};

export default Header;

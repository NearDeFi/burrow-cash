import { useState, useEffect } from "react";
import { useTheme, Box, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";

import LogoIcon from "../../public/logo.svg";
import WalletButton from "./WalletButton";
import DarkSwitch from "../DarkSwitch";
import { Wrapper, Logo, Menu, LinkStyled } from "./style";
import { useAppSelector } from "../../redux/hooks";
import { isAssetsFetching } from "../../redux/assetsSelectors";
import { useDarkMode, useViewAs } from "../../hooks/hooks";
import { Stats } from "./stats";

const MenuItem = ({ title, pathname, sx = {} }) => {
  const router = useRouter();
  const theme = useTheme();
  const isSelected = router.asPath.includes(pathname);

  const style = isSelected ? { borderBottomColor: theme.palette.primary.main, opacity: 1 } : {};

  return (
    <Link href={pathname}>
      <LinkStyled sx={{ ...style, ...sx }}>{title}</LinkStyled>
    </Link>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const isFetching = useAppSelector(isAssetsFetching);
  const isViewingAs = useViewAs();
  const theme = useTheme();
  const { isDark } = useDarkMode();

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

  return (
    <Box
      sx={{
        background: theme.custom.headerBackground,
        mb: { xs: "1rem", sm: "2rem" },
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
        <Logo>
          <LogoIcon style={{ fill: "white" }} />
        </Logo>
        <Menu>
          <MenuItem title="Deposit" pathname="/deposit" />
          <MenuItem title="Borrow" pathname="/borrow" />
          <MenuItem title="Portfolio" pathname="/portfolio" />
          <MenuItem title="Staking" pathname="/staking" />
          <MenuItem
            title="Bridge"
            pathname="/bridge"
            sx={{
              color: isDark ? theme.palette.primary.main : theme.palette.primary.light,
              fontWeight: "bold",
            }}
          />
        </Menu>
        <Box display="flex" justifyContent="flex-end">
          <DarkSwitch />
          <WalletButton />
        </Box>
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

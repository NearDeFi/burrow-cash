import { useLocation } from "react-router-dom";
import { useTheme, useMediaQuery, Box } from "@mui/material";

import BackgroundDesktop from "./bg-desktop.svg";
import BackgroundMobile from "./bg-mobile.svg";
import LogoIcon from "../../assets/logo.svg";
import { Wrapper, Logo, Menu, LinkStyled } from "./style";
import WalletButton from "./WalletButton";

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
  const matches = useMediaQuery("(min-width:1200px)");
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
        <MenuItem title="Deposit" pathname="/supply" />
        <MenuItem title="Borrow" pathname="/borrow" />
        <MenuItem title="Portfolio" pathname="/portfolio" />
      </Menu>
      <WalletButton />
    </Wrapper>
  );
};

export default Header;

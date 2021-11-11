import { useHistory } from "react-router";
import { useTheme } from "@mui/material";

import LogoIcon from "../../assets/logo.svg";
import { Wrapper, Logo, Menu, ButtonStyled } from "./style";
import WalletButton from "./WalletButton";

const MenuItem = ({ title, location }) => {
  const history = useHistory();
  const theme = useTheme();
  const isSelected = history.location.pathname === location;

  const handleClick = () => {
    history.push(location);
  };

  const style = isSelected ? { borderBottomColor: theme.palette.primary.main } : {};

  return (
    <ButtonStyled variant="outlined" size="medium" onClick={handleClick} sx={style}>
      {title}
    </ButtonStyled>
  );
};

const Header = () => {
  return (
    <Wrapper>
      <Logo>
        <LogoIcon />
      </Logo>
      <Menu>
        <MenuItem title="Supply" location="/supply" />
        <MenuItem title="Borrow" location="/borrow" />
        <MenuItem title="Portfolio" location="/portfolio" />
      </Menu>
      <WalletButton />
    </Wrapper>
  );
};

export default Header;

import { useHistory } from "react-router";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import BackgroundDesktop from "./bg-desktop.svg";
import BackgroundMobile from "./bg-mobile.svg";
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
					top: 0,
					bottom: 0,
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
				<MenuItem title="Supply" location="/supply" />
				<MenuItem title="Borrow" location="/borrow" />
				<MenuItem title="Portfolio" location="/portfolio" />
			</Menu>
			<WalletButton />
		</Wrapper>
	);
};

export default Header;

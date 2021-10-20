import Toolbar from "@mui/material/Toolbar";
import styled from "styled-components";
import topDesktopBg from "../../assets/desktop-top-background.jpg";
import mobileTopBg from "../../assets/mobile-top-bg.jpg";

export const DesktopHeaderWrapper = styled.div`
	background-size: cover;
	background-image: url(${topDesktopBg});
	height: 23em;
`;

export const DesktopHeaderToolbar = styled(Toolbar)`
	justify-content: space-between;
	min-height: 5em !important;
`;

export const DesktopHeaderLeftSideWrapper = styled(Toolbar)`
	display: grid;
	width: 30%;
	grid-gap: 5em;
	grid-template-columns: 0.5fr 1fr 1fr 1fr;
`;

export const DesktopHeaderRightSideWrapper = styled(Toolbar)`
	justify-content: space-between;
	min-height: 5em !important;
`;

export const MobileHeaderWrapper = styled.div`
	min-height: 9em;
	background-size: cover;
	background-image: url(${mobileTopBg});
`;

export const MobileHeaderToolbar = styled(Toolbar)`
	justify-content: space-between;
`;

export const MobileSubHeaderToolbar = styled(Toolbar)`
	justify-content: space-between;
`;

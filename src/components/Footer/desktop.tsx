import Typography from "@mui/material/Typography";
import Logo from "../../assets/logo.svg";
import * as SC from "./style";

const DesktopFooter = () => {
	return (
		<SC.DesktopFooterWrapper>
			<SC.DesktopFooterLeftSideWrapper>
				<Typography variant="h6" style={{ color: "#00BACF", display: "inline" }}>
					<Logo />
				</Typography>
				<Typography variant="h6" style={{ color: "#000741", display: "inline" }}>
					© 2021 All Rights Reserved.
				</Typography>
			</SC.DesktopFooterLeftSideWrapper>
			<SC.DesktopFooterRightSideWrapper>
				<Typography variant="h6">
					<span style={{ cursor: "pointer" }}>Terms of Service</span> |
					<span style={{ cursor: "pointer" }}>Privacy Policy</span>
				</Typography>
			</SC.DesktopFooterRightSideWrapper>
		</SC.DesktopFooterWrapper>
	);
};

export default DesktopFooter;

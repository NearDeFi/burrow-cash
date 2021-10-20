import { Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import Logo from "../../assets/logo.svg";
import * as SC from "./style";

const MobileFooter = () => {
	return (
		<SC.MobileFooterWrapper>
			<SC.MobileFooterLeftSideWrapper>
				<Typography variant="h6" style={{ color: "#00BACF", gridRow: 1 }}>
					<Logo />
				</Typography>
				<Typography
					variant="h6"
					style={{ gridRow: 1, fontSize: "12px", fontWeight: 500, color: "#000741" }}
				>
					© 2021 All Rights Reserved.
				</Typography>
			</SC.MobileFooterLeftSideWrapper>
			<SC.MobileFooterRightSideWrapper>
				<Typography>Terms of Service</Typography>
				<Divider orientation={"vertical"} flexItem />
				<Typography>Privacy Policy</Typography>
			</SC.MobileFooterRightSideWrapper>
		</SC.MobileFooterWrapper>
	);
};

export default MobileFooter;

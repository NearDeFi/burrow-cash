import { Link, Divider } from "@mui/material";
// import BackgroundFooter from "./bg-footer.svg";
import Logo from "../../assets/logo.svg";
import { Wrapper, CopyWrapper, LinksWrapper, LogoWrapper, Copyright } from "./style";

const Footer = () => (
  <Wrapper style={{ position: "relative" }}>
    {/* <Box
			sx={{
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: "-1",
				pointerEvents: "none",
			}}
		>
			<BackgroundFooter />
		</Box> */}
    <CopyWrapper>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <Copyright variant="h6">© 2021 All Rights Reserved.</Copyright>
    </CopyWrapper>
    <LinksWrapper>
      <Link href="/terms" underline="none" color="secondary.main">
        Terms of Service
      </Link>
      <Divider orientation="vertical" flexItem color="secondary" />
      <Link href="/privacy" underline="none" color="secondary.main">
        Privacy Policy
      </Link>
    </LinksWrapper>
  </Wrapper>
);

export default Footer;

import useMobileDetect from "use-mobile-detect-hook";
import DesktopFooter from "./desktop";
import MobileFooter from "./mobile";

const Footer = () => {
	const detectMobile = useMobileDetect();

	return detectMobile.isMobile() ? <MobileFooter /> : <DesktopFooter />;
};

export default Footer;

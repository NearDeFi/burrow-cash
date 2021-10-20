import React from "react";
// @ts-ignore
import useMobileDetect from "use-mobile-detect-hook";
import DesktopHeader from "./desktop";
import MobileHeader from "./mobile";

const Header = ({ children }: { children: React.ReactChild }) => {
	const detectMobile = useMobileDetect();
	const isMobile = detectMobile.isMobile();
	if (isMobile) {
		return <MobileHeader />;
	} else {
		return <DesktopHeader>{children}</DesktopHeader>;
	}
};

export default Header;

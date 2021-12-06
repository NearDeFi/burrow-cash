import { Link, Divider, Box } from "@mui/material";

import { FaDiscord, FaTwitter, FaMedium, FaGithub } from "react-icons/fa";
import { SiGitbook } from "react-icons/si";

// import BackgroundFooter from "./bg-footer.svg";
import Logo from "../../assets/logo.svg";
import { Wrapper, CopyWrapper, LinksWrapper, LogoWrapper, Copyright } from "./style";

const Footer = () => (
  <Wrapper>
    {/*
    <Box
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
    </Box>
    */}
    <CopyWrapper>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <Copyright variant="h6">© 2021 All Rights Reserved.</Copyright>
    </CopyWrapper>
    <LinksWrapper>
      <Links />
      <Divider orientation="vertical" flexItem color="secondary" />
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

const Links = () => (
  <Box
    display="grid"
    gridTemplateColumns="repeat(5, 1fr)"
    alignItems="center"
    gap={["0.5rem", "1rem"]}
    lineHeight="0"
  >
    <Link href="https://github.com/NearDeFi/" title="GitHub" target="_blank" color="#000">
      <FaGithub />
    </Link>
    <Link
      href="https://discord.com/channels/912857183455154196/912857184247889992"
      title="Discord"
      target="_blank"
      color="#000"
    >
      <FaDiscord />
    </Link>
    <Link href="https://twitter.com/burrowcash" title="Twitter" target="_blank" color="#000">
      <FaTwitter />
    </Link>
    <Link href="https://burrowcash.medium.com/" title="Medium" target="_blank" color="#000">
      <FaMedium />
    </Link>
    <Link href="https://docs.burrow.cash/" title="Docs" target="_blank" color="#000">
      <SiGitbook />
    </Link>
  </Box>
);

export default Footer;

import { Link, Divider, Box } from "@mui/material";

import { FaDiscord } from "@react-icons/all-files/fa/FaDiscord";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";
import { FaMedium } from "@react-icons/all-files/fa/FaMedium";
import { FaGithub } from "@react-icons/all-files/fa/FaGithub";

import Logo from "../../public/logo.svg";
import Gitbook from "../../public/GitBook.svg";
import { Wrapper, CopyWrapper, LinksWrapper, LogoWrapper, Copyright } from "./style";

const Footer = () => (
  <Wrapper>
    <CopyWrapper>
      <LogoWrapper>
        <Logo />
      </LogoWrapper>
      <Copyright variant="h6">© 2022 All Rights Reserved.</Copyright>
      <LinksWrapper>
        <Terms />
      </LinksWrapper>
    </CopyWrapper>
    <LinksWrapper>
      <Links />
    </LinksWrapper>
  </Wrapper>
);

const Links = () => (
  <Box
    display="grid"
    gridTemplateColumns="repeat(5, 1fr)"
    alignItems="center"
    lineHeight="0"
    sx={{ gap: ["0.5rem", "1rem"] }}
  >
    <Link href="https://github.com/NearDeFi/" title="GitHub" target="_blank" color="#000">
      <FaGithub />
    </Link>
    <Link href="https://discord.gg/gUWBKy9Vur" title="Discord" target="_blank" color="#000">
      <FaDiscord />
    </Link>
    <Link href="https://twitter.com/burrowcash" title="Twitter" target="_blank" color="#000">
      <FaTwitter />
    </Link>
    <Link href="https://burrowcash.medium.com/" title="Medium" target="_blank" color="#000">
      <FaMedium />
    </Link>
    <Link href="https://docs.burrow.cash/" title="Docs" target="_blank" color="#000" width="16px">
      <Gitbook />
    </Link>
  </Box>
);

export const Terms = () => (
  <>
    <Divider orientation="vertical" flexItem color="secondary" />
    <Link
      href="https://github.com/NearDeFi/burrow-cash/blob/main/DECLARATION.md"
      underline="none"
      color="secondary.main"
      target="_blank"
    >
      Declaration and Disclaimers
    </Link>
  </>
);

export default Footer;

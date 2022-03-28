import { Box, Alert, Link } from "@mui/material";

import Footer from "../Footer";
import Header from "../Header";

export const Banner = () => (
  <Alert severity="success" sx={{ pl: ["20px", "28px"] }}>
    <Link
      href="https://burrowcash.medium.com/printer-goes-betabrrr-b7faa2ae9bd3"
      title="Printer goes betaBRRR"
      target="_blank"
    >
      We’re announcing betaBRRR, a very, very worthless test token for the public beta release!
    </Link>
  </Alert>
);

const Layout = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateRows: "auto auto 1fr auto",
      gridTemplateColumns: "100%",
      minHeight: "100%",
    }}
  >
    <Header />
    <main>{children}</main>
    <Footer />
  </Box>
);

export default Layout;

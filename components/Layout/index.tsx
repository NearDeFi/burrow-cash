import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import { useViewAs } from "../../hooks/hooks";
import { useTicker } from "../../hooks/useTicker";
import CheckNewAppVersion from "../CheckNewAppVersion";
import Footer from "../Footer";
import Header from "../Header";
import Ticker from "../Ticker";
import Blocked from "../Blocked";
import { useBlocked } from "../../hooks/useBlocked";

const Layout = ({ children }) => {
  const isViewingAs = useViewAs();
  const { hasTicker } = useTicker();
  const isBlocked = useBlocked();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "auto auto 1fr auto",
        gridTemplateColumns: "100%",
        minHeight: "100%",
        border: isViewingAs ? "10px solid #47C880" : "none",
        WebkitTapHighlightColor: "transparent",
        position: "relative",
        filter: isBlocked ? "blur(10px)" : "none",
      }}
    >
      <AnimatePresence>
        {hasTicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 40, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.5 } }}
          >
            <Ticker />
          </motion.div>
        )}
      </AnimatePresence>
      <Header />
      <main>{children}</main>
      <Footer />
      <CheckNewAppVersion />
      {isBlocked && <Blocked />}
    </Box>
  );
};

export default Layout;

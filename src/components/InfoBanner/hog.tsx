import { Box } from "@mui/material";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

import { useAppDispatch } from "../../redux/hooks";
import { useTicker } from "../../hooks";
import { orderFeed } from "../../redux/feedSlice";
import Hog from "./hog.svg";
import HogCool from "./hog-cool.svg";
import { isTestnet } from "../../utils";

const hogVariants = {
  small: {
    top: "1.5rem",
    transition: { duration: 0.5 },
  },
  cool: {
    top: "1rem",
    transition: { duration: 0.5 },
  },
};

export const BurrowHog = () => {
  const { hasTicker, toggleTicker } = useTicker();
  const hogControls = useAnimation();
  const dispatch = useAppDispatch();

  const handleClickHog = () => {
    if (isTestnet) return;
    toggleTicker();
    if (!hasTicker) {
      dispatch(orderFeed());
      hogControls.start("cool");
    } else {
      hogControls.start("small");
    }
  };

  return (
    <Box top="0" bottom="0" height="100%" width="70px" overflow="hidden">
      <Box
        top="0.8rem"
        left="0.5rem"
        position="relative"
        zIndex={2}
        sx={{ cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
        onClick={handleClickHog}
        component={motion.div}
        variants={hogVariants}
        initial={hasTicker ? "cool" : "small"}
        animate={hogControls}
      >
        <AnimatePresence>{hasTicker ? <HogCool /> : <Hog />}</AnimatePresence>
      </Box>
    </Box>
  );
};

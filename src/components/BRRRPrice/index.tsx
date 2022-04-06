import { Box } from "@mui/material";
import { shuffle } from "lodash";

const bRRRPriceTickers = ["🚀 🌒", "🍄 🤖", "🎁 🤑", "💰 💸"];

const BRRRPrice = () => {
  return <Box>{shuffle(bRRRPriceTickers)[0]}</Box>;
};

export default BRRRPrice;

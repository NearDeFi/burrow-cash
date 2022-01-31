import { Box } from "@mui/material";

import Input from "../Input";
import Slider from "../Slider";
import { updateAmount } from "../../redux/appSlice";
import { useAppDispatch } from "../../redux/hooks";
import { PERCENT_DIGITS } from "../../store";

export default function Controls({ amount, available }) {
  const dispatch = useAppDispatch();

  const handleInputChange = (e) => {
    if (Number(e.target.value) > available) return;
    dispatch(updateAmount({ isMax: false, amount: Number(e.target.value) || 0 }));
  };

  const handleMaxClick = () => {
    dispatch(updateAmount({ isMax: true, amount: Number(available) }));
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleSliderChange = (e) => {
    const { value: percent } = e.target;
    const value = (Number(available) * percent) / 100;
    dispatch(updateAmount({ isMax: false, amount: Number(value.toFixed(PERCENT_DIGITS)) }));
  };

  const sliderValue = Math.round((amount * 100) / available);

  const inputAmount = `${amount}`
    .replace(/[^0-9.-]/g, "")
    .replace(/(\..*)\./g, "$1")
    .replace(/(?!^)-/g, "")
    .replace(/^0+(\d)/gm, "$1");

  return (
    <>
      <Input
        value={inputAmount}
        type="number"
        step="0.01"
        onClickMax={handleMaxClick}
        onChange={handleInputChange}
        onFocus={handleFocus}
      />
      <Box mx="1.5rem" my="1rem">
        <Slider value={sliderValue} onChange={handleSliderChange} />
      </Box>
    </>
  );
}

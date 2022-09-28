import { Box } from "@mui/material";

import Input from "../Input";
import Slider from "../Slider";
import { updateAmount } from "../../redux/appSlice";
import { useAppDispatch } from "../../redux/hooks";
import { trackMaxButton } from "../../utils/telemetry";

export default function Controls({ amount, available, action, tokenId }) {
  const dispatch = useAppDispatch();

  const handleInputChange = (e) => {
    if (Number(e.target.value) > available) return;
    dispatch(updateAmount({ isMax: false, amount: e.target.value || 0 }));
  };

  const handleMaxClick = () => {
    trackMaxButton({ amount: Number(available), action, tokenId });
    dispatch(updateAmount({ isMax: true, amount: Number(available) }));
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleSliderChange = (e) => {
    const { value: percent } = e.target;
    const value = (Number(available) * percent) / 100;

    dispatch(
      updateAmount({
        isMax: value === Number(available),
        amount: value,
      }),
    );
  };

  const sliderValue = Math.round((amount * 100) / available) || 0;

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

import pluralize from "pluralize";

import { SliderStyled } from "./style";

const marks = Array.from(new Array(12)).map((_, i) => ({
  value: i + 1,
  label: i === 0 || i === 11 ? i + 1 : "",
}));

function valuetext(value: number) {
  return `${value}%`;
}

interface Props {
  value: number;
  onChange?: (e: Event) => void;
}

const Slider = ({ value = 1, onChange }: Props) => {
  return (
    <SliderStyled
      aria-label="Month amount slider"
      getAriaValueText={valuetext}
      valueLabelDisplay="auto"
      value={value}
      defaultChecked
      step={1}
      min={1}
      max={12}
      valueLabelFormat={(v) => pluralize("Month", v, true)}
      marks={marks}
      onChange={onChange}
    />
  );
};

export default Slider;

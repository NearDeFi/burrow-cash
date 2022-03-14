import pluralize from "pluralize";

import { SliderStyled } from "./style";

const marks = Array.from(new Array(12)).map((_, i) => ({ value: i + 1, label: i + 1 }));

function valuetext(value: number) {
  return `${value}%`;
}

interface Props {
  value: number;
  onChange?: (e: Event) => void;
}

const Slider = ({ value = 0, onChange }: Props) => {
  return (
    <SliderStyled
      aria-label="Amount slider"
      value={value}
      getAriaValueText={valuetext}
      valueLabelDisplay="auto"
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

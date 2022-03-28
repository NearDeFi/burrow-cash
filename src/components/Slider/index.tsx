import { SliderStyled } from "./style";

const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 25,
    label: "25%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 75,
    label: "75%",
  },
  {
    value: 100,
    label: "100%",
  },
];

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
      step={0.01}
      valueLabelFormat={(v) => `${Math.round(v || 0)}%`}
      marks={marks}
      onChange={onChange}
    />
  );
};

export default Slider;

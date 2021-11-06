import { Slider as MUISlider, Box } from "@mui/material";
import { useState, useEffect } from "react";

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
	onChange?: (value: number) => void;
}

const Slider = ({ value, onChange }: Props) => {
	const [controlledValue, setControlledValue] = useState<any>(value);

	useEffect(() => setControlledValue(value), [value]);

	const handleChange = (e) => {
		setControlledValue(e.target.value);
		if (onChange) onChange(Number(e.target.value));
	};

	return (
		<Box sx={{ padding: "0 1.5rem", margin: "0 auto" }}>
			<MUISlider
				aria-label="Custom marks"
				value={controlledValue}
				getAriaValueText={valuetext}
				valueLabelDisplay="auto"
				step={1}
				valueLabelFormat={(v) => `${Math.round(v)}%`}
				marks={marks}
				onChange={handleChange}
			/>
		</Box>
	);
};

export default Slider;

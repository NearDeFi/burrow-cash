import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useState, useEffect } from "react";

import MaxIcon from "./max.svg";

interface inputFieldProps {
	type?: string;
	value?: any;
	max: number;
	onChange?: (value: number) => void;
}

/** initial version, should be updated as needed */
const InputField = (props: inputFieldProps) => {
	const { value, type, onChange, max, ...rest } = props;
	const [controlledValue, setControlledValue] = useState<any>(value);

	useEffect(() => setControlledValue(value), [value]);

	const handleMax = () => {
		setControlledValue(max);
		if (onChange) onChange(max);
	};

	const handleChange = (e) => {
		setControlledValue(e.target.value);
		if (onChange) onChange(Number(e.target.value));
	};

	return (
		<OutlinedInput
			id="input-box"
			className="input-box"
			type={type || "string"}
			value={controlledValue}
			style={{ width: "100%" }}
			inputProps={{ min: 0 }}
			onChange={handleChange}
			{...rest}
			endAdornment={
				<InputAdornment position="end">
					<IconButton aria-label="max value" onClick={handleMax}>
						<MaxIcon />
					</IconButton>
				</InputAdornment>
			}
		/>
	);
};

export default InputField;

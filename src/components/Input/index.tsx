import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import { ChangeEvent, useState } from "react";

import MaxIcon from "./max.svg";

interface inputFieldProps {
	type?: string;
	value?: any;
	onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

/** initial version, should be updated as needed */
const InputField = (props: inputFieldProps) => {
	const { value, type, onChange, ...rest } = props;
	const [controlledValue, setControlledValue] = useState<any>(value);
	return (
		<OutlinedInput
			id="input-box"
			className="input-box"
			type={type || "string"}
			value={controlledValue}
			style={{ width: "100%" }}
			inputProps={{ min: 0 }}
			onChange={(e) => {
				setControlledValue(e.target.value);
				if (onChange) onChange(e);
			}}
			{...rest}
			endAdornment={
				<InputAdornment position="end">
					<IconButton aria-label="max value" onClick={() => null}>
						<MaxIcon />
					</IconButton>
				</InputAdornment>
			}
		/>
	);
};

export default InputField;

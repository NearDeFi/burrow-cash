import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import MaxIcon from "./max.svg";
import React, { ChangeEvent, useState } from "react";

interface inputFieldProps {
	type?: string;
	value?: any;
	onChange?: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

/** initial version, should be updated as needed */
const InputField = (props: inputFieldProps) => {
	const [value, setValue] = useState<any>(props.value);
	return (
		<OutlinedInput
			id="input-box"
			className={"input-box"}
			type={props.type || "string"}
			value={value}
			style={{ width: "100%" }}
			onChange={(e) => {
				setValue(e.target.value);
				if (props.onChange) props.onChange(e);
			}}
			endAdornment={
				<InputAdornment position="end">
					<IconButton aria-label="toggle password visibility" onClick={() => {}}>
						<MaxIcon />
					</IconButton>
				</InputAdornment>
			}
		/>
	);
};

export default InputField;

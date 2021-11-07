import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";

import MaxIcon from "./max.svg";

interface inputFieldProps {
	type?: string;
	value?: number;
	onChange?: (e: React.SyntheticEvent) => void;
	onClickMax?: (e: React.SyntheticEvent) => void;
}

const InputField = (props: inputFieldProps) => {
	const { value, type, onChange, onClickMax, ...rest } = props;
	return (
		<OutlinedInput
			id="input-box"
			className="input-box"
			type={type || "string"}
			value={value}
			style={{ width: "100%" }}
			inputProps={{ min: 0 }}
			onChange={onChange}
			{...rest}
			endAdornment={
				<InputAdornment position="end">
					<IconButton aria-label="max value" onClick={onClickMax}>
						<MaxIcon />
					</IconButton>
				</InputAdornment>
			}
		/>
	);
};

export default InputField;

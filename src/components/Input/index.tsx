import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import MaxIcon from "./max.svg";

/** initial version, should be updated as needed */
const InputField = () => {
	return (
		<OutlinedInput
			id="standard-adornment-password"
			type={"string"}
			value={"0"}
			style={{ width: "100%" }}
			onChange={() => {}}
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

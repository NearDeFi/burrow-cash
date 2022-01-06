import { IconButton, InputAdornment } from "@mui/material";

import MaxIcon from "./max.svg";
import { Input } from "./style";

interface inputFieldProps {
  type?: string;
  value?: number | string;
  step?: string;
  onChange?: (e: React.SyntheticEvent) => void;
  onClickMax?: (e: React.SyntheticEvent) => void;
  onFocus?: (e: React.SyntheticEvent) => void;
}

const InputField = (props: inputFieldProps) => {
  const { value, type, onChange, onClickMax, step, ...rest } = props;
  return (
    <Input
      type={type || "string"}
      value={value}
      inputProps={{ min: 0, step }}
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

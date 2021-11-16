import CloseIcon from "@mui/icons-material/Close";
import { Button, Switch, Typography, Box } from "@mui/material";
import { useState } from "react";
import { Input, Slider } from "../..";
import { colors } from "../../../style";
import { Inputs, ListEntry } from "../types";
import TokenIcon from "../../TokenIcon";
import { PERCENT_DIGITS, TOKEN_FORMAT, USD_FORMAT } from "../../../store/constants";

export const CloseModalIcon = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <div
      onClick={closeModal}
      aria-hidden="true"
      style={{ position: "absolute", cursor: "pointer", right: "8px" }}
    >
      <CloseIcon />
    </div>
  );
};

export const ModalTitle = ({ title }: { title: string }) => {
  return (
    <Typography
      id="modal-modal-title"
      style={{
        textAlign: "center",
        color: colors.secondary,
        fontWeight: 500,
        fontSize: "24px",
      }}
      variant="h6"
      component="h2"
      sx={{ mt: 2 }}
    >
      {title}
    </Typography>
  );
};

export const TokenInputs = ({
  availableTokens,
  tokenSymbol,
  tokenPriceInUSD,
  totalAmountTitle,
  onChange,
  defaultValue = 0,
}: {
  availableTokens: number;
  tokenSymbol: string;
  tokenPriceInUSD: number;
  totalAmountTitle: string;
  onChange: (amount: number) => void;
  defaultValue?: number;
}) => {
  const totalAvailableTokensPrice = Number(availableTokens) * Number(tokenPriceInUSD);
  const [totalAmount, setTotalAmount] = useState(defaultValue * tokenPriceInUSD);
  const [sliderValue, setSliderValue] = useState((100 * defaultValue) / Number(availableTokens));
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleMaxClick = () => {
    if (!availableTokens) return;
    const e = { target: { value: availableTokens } };
    handleInputChange(e);
  };

  const handleInputChange = (e) => {
    if (!availableTokens) return;
    const { value } = e.target;

    if (!Number.isNaN(value)) {
      setTotalAmount(value * tokenPriceInUSD);
      setInputValue(value);
      setSliderValue((value * 100) / Number(availableTokens));
      if (onChange) onChange(value);
    }
  };

  const handleSliderChange = (e) => {
    if (!availableTokens) return;
    const { value: percent } = e.target;
    const value = (Number(availableTokens) * percent) / 100;

    setTotalAmount(value * tokenPriceInUSD);
    setInputValue(value);
    setSliderValue((value * 100) / Number(availableTokens));
    if (onChange) onChange(value);
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          padding: "1em",
          fontSize: "14px",
          fontWeight: 500,
          gridTemplateColumns: "1.1fr 0.9fr",
          color: colors.secondary,
        }}
      >
        <div>{`Available: ${availableTokens.toLocaleString(
          undefined,
          TOKEN_FORMAT,
        )} ${tokenSymbol} (${totalAvailableTokensPrice.toLocaleString(
          undefined,
          USD_FORMAT,
        )})`}</div>
        <div style={{ justifySelf: "end" }}>{`1 ${tokenSymbol} = ${tokenPriceInUSD.toLocaleString(
          undefined,
          USD_FORMAT,
        )}`}</div>
      </div>
      <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
        <Input
          value={inputValue}
          type="number"
          onClickMax={handleMaxClick}
          onChange={handleInputChange}
        />
      </div>
      <Box px="1.5rem" mt="1rem">
        <Slider value={sliderValue} onChange={handleSliderChange} />
      </Box>
      <Typography
        style={{ textAlign: "center", fontSize: "1rem", fontWeight: 500 }}
        id="modal-modal-description"
        sx={{ mt: 2 }}
      >
        <span>{totalAmountTitle} = </span>
        <span>{totalAmount.toLocaleString(undefined, USD_FORMAT)}</span>
      </Typography>
    </>
  );
};

const createListItem = ({ title, value, valueType = Inputs.String }: ListEntry) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridGap: "2em",
        padding: "1em",
        paddingTop: 0,
      }}
    >
      <div style={{ color: colors.secondary, fontSize: "14px", fontWeight: 400 }}>{title}</div>
      {valueType === Inputs.String && (
        <div
          style={{
            color: colors.secondary,
            justifySelf: "end",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          {value}
        </div>
      )}
      {valueType === Inputs.Switch && (
        <div style={{ justifySelf: "end" }}>
          <Switch />
        </div>
      )}
    </div>
  );
};

export const Rates = ({ ratesTitle, rates }: { ratesTitle?: string; rates?: ListEntry[] }) => {
  return rates && rates?.length > 0 ? (
    <>
      <div style={{ padding: "1em", fontSize: "14px", fontWeight: 500 }}>{ratesTitle}</div>
      {rates?.map((r) => createListItem(r))}
    </>
  ) : null;
};

export const ActionButton = ({
  isDisabled = false,
  text,
  onClick,
}: {
  isDisabled: boolean;
  text: string;
  onClick?: () => void;
}) => {
  return (
    <Typography
      style={{ textAlign: "center", color: colors.secondary }}
      id="modal-modal-description"
      sx={{ mt: 2 }}
    >
      <Button
        disabled={isDisabled}
        style={{ backgroundColor: colors.primary }}
        variant="contained"
        onClick={onClick}
      >
        {text}
      </Button>
    </Typography>
  );
};

export const TokenBasicDetails = ({
  tokenName,
  icon,
  apy,
}: {
  tokenName: string;
  icon?: string;
  apy: number;
}) => {
  return (
    <>
      <div style={{ display: "grid", justifyContent: "center", marginTop: "2em" }}>
        <TokenIcon icon={icon} />
      </div>
      <Typography
        style={{ textAlign: "center", color: colors.secondary, fontSize: "14px", fontWeight: 500 }}
        id="modal-modal-description"
        sx={{ mt: 2 }}
      >
        {tokenName}
        <br />
        {`${Number(apy).toFixed(PERCENT_DIGITS)}% APY`}
      </Typography>
    </>
  );
};

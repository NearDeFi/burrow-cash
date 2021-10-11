import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Button, Switch, Typography } from "@mui/material";
import { Input, Stepper } from "../..";
import { Inputs } from "../types";

export const CloseModalIcon = ({ closeModal }: { closeModal: () => void }) => {
	return (
		<div onClick={closeModal} style={{ position: "absolute", cursor: "pointer", right: "8px" }}>
			<CloseIcon />
		</div>
	);
};

export const ModalTitle = ({ title }: { title: string }) => {
	return (
		<Typography
			id="modal-modal-title"
			style={{ textAlign: "center " }}
			variant="h6"
			component="h2"
			sx={{ mt: 8 }}
		>
			{title}
		</Typography>
	);
};

export const TokenInputs = ({
	availableTokens,
	tokenSymbol,
	tokenPriceInUSD,
	totalAmount,
	totalAmountTitle,
}: {
	availableTokens: number;
	tokenSymbol: string;
	tokenPriceInUSD: number;
	totalAmountTitle: string;
	totalAmount: number;
}) => {
	const totalAvialabeTokensPrice = Number(availableTokens) * Number(tokenPriceInUSD);
	return (
		<>
			<div style={{ display: "grid", padding: "1em", gridTemplateColumns: "1.1fr 0.9fr" }}>
				<div>{`Available: ${availableTokens} ${tokenSymbol} ($${totalAvialabeTokensPrice})`}</div>
				<div style={{ justifySelf: "end" }}>{`1 ${tokenSymbol} = $${tokenPriceInUSD}`}</div>
			</div>
			<div style={{ paddingLeft: "1em", paddingRight: "1em" }}>
				<Input />
			</div>
			<div style={{ paddingTop: "1em" }}>
				<Stepper />
			</div>
			<Typography style={{ textAlign: "center " }} id="modal-modal-description" sx={{ mt: 2 }}>
				{`${totalAmountTitle} = ${totalAmount}`}
			</Typography>
		</>
	);
};

const createListItem = ({
	title,
	value,
	valueType = Inputs.String,
}: {
	title: string;
	value: any;
	valueType?: Inputs;
}) => {
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
			<div>{title}</div>
			{valueType === Inputs.String && <div style={{ justifySelf: "end" }}>{value}</div>}
			{valueType === Inputs.Switch && (
				<div style={{ justifySelf: "end" }}>
					<Switch />
				</div>
			)}
		</div>
	);
};

export const Rates = ({ ratesTitle, rates }: { ratesTitle: string; rates: any[] }) => {
	return (
		<>
			<div style={{ padding: "1em" }}>{ratesTitle}</div>
			{rates?.map((r) => createListItem(r))}
		</>
	);
};

export const ActionButton = ({ text }: { text: string }) => {
	return (
		<Typography style={{ textAlign: "center " }} id="modal-modal-description" sx={{ mt: 2 }}>
			<Button variant="contained">{text}</Button>
		</Typography>
	);
};

export const TokenBasicDetails = ({ tokenName, apy }: { tokenName: string; apy: number }) => {
	return (
		<>
			<div style={{ display: "grid", justifyContent: "center", marginTop: "2em" }}>
				<Avatar />
			</div>
			<Typography style={{ textAlign: "center " }} id="modal-modal-description" sx={{ mt: 2 }}>
				{tokenName}
				<br />
				{`${apy}$ APY`}
			</Typography>
		</>
	);
};

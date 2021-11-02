import { ActionButton, ModalTitle, Rates, TokenBasicDetails, TokenInputs } from "../components";
import { TokenActionsInput } from "../types";
import { useState } from "react";
import { addCollateral, borrow, supply } from "../../../store/tokens";

const borrowRates = [
	{ value: "1.00%", title: "Borrow APY" },
	{ value: "2.00%", title: "Extra Rewards APY" },
	{ value: "3.00%", title: "Risk Factor" },
	{ value: "4.00%", title: "Limit Used" },
	{ value: "1,000,000", title: "Pool Liquidit" },
];

export const BorrowData: TokenActionsInput = {
	type: "Borrow",
	title: "Borrow",
	totalAmountTitle: "Borrow Amount",
	buttonText: "Borrow",
	rates: borrowRates,
	ratesTitle: "Rates",
	asset: {
		token_id: "wrap.testnet",
		amount: 2,
		name: "Token Name",
		symbol: "TSYL",
		valueInUSD: 5,
		apy: 10,
	},
};

export const TokenActionsTemplate = (input: TokenActionsInput) => {
	const { title, asset, totalAmountTitle, buttonText, rates, ratesTitle, type } = input;
	const [amount, setAmount] = useState(0);

	return (
		<>
			<ModalTitle title={title} />
			<TokenBasicDetails tokenName={asset.name} icon={asset.icon} apy={asset.apy} />
			<TokenInputs
				availableTokens={asset.amount}
				tokenSymbol={asset.symbol}
				tokenPriceInUSD={asset.valueInUSD}
				totalAmountTitle={totalAmountTitle}
				onChange={(amount) => setAmount(amount)}
			/>
			<Rates rates={rates} ratesTitle={ratesTitle} />

			<ActionButton
				text={buttonText}
				onClick={() => {
					if (type === "Borrow") void borrow(asset.token_id, amount);
					else void supply(asset.token_id, amount);
				}}
			/>

			{type === "Borrow" && (
				<ActionButton
					text={"Add collateral"}
					onClick={() => {
						void addCollateral(asset.token_id);
					}}
				/>
			)}
		</>
	);
};

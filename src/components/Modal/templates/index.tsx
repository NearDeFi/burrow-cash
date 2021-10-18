import { ActionButton, ModalTitle, Rates, TokenBasicDetails, TokenInputs } from "../components";
import { TokenActionsInput } from "../types";

const borrowRates = [
	{ value: "1.00%", title: "Borrow APY" },
	{ value: "2.00%", title: "Extra Rewards APY" },
	{ value: "3.00%", title: "Risk Factor" },
	{ value: "4.00%", title: "Limit Used" },
	{ value: "1,000,000", title: "Pool Liquidit" },
];

export const BorrowData: TokenActionsInput = {
	title: "Borrow",
	totalAmountTitle: "Borrow Amount",
	totalAmount: 0,
	buttonText: "Borrow",
	rates: borrowRates,
	ratesTitle: "Borrow Rates",
	token: { count: 2, name: "Token Name", symbol: "TSYL", valueInUSD: 5, apy: 10 },
};

export const TokenActionsTemplate = (input: TokenActionsInput) => {
	const { title, token, totalAmount, totalAmountTitle, buttonText, rates, ratesTitle } = input;

	return (
		<>
			<ModalTitle title={title} />
			<TokenBasicDetails tokenName={token.name} apy={token.apy} />
			<TokenInputs
				availableTokens={token.count}
				tokenSymbol={token.symbol}
				tokenPriceInUSD={token.valueInUSD}
				totalAmount={totalAmount}
				totalAmountTitle={totalAmountTitle}
			/>
			<Rates rates={rates} ratesTitle={ratesTitle} />
			<ActionButton text={buttonText} />
		</>
	);
};

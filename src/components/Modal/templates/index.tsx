import { ActionButton, ModalTitle, Rates, TokenBasicDetails, TokenInputs } from "../components";
import { TokenActionsInput } from "../types";

const borrowRates = [
	{ value: "", title: "Borrow APY" },
	{ value: "", title: "Extra Rewards APY" },
	{ value: "", title: "Risk Factor" },
	{ value: "", title: "Limit Used" },
	{ value: "", title: "Pool Liquidit" },
]

export const BorrowData: TokenActionsInput = {
	title: 'Borrow',
	totalAmountTitle: 'Borrow Amount',
	totalAmount: 0,
	buttonText: 'Borrow',
	rates: borrowRates,
	ratesTitle: "Borrow Rates",
	token: { count: 0, name: "T Name", symbol: "TSYL", valueInUSD: 0, apy: 0 },
}

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
	)
}
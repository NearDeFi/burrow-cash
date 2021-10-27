import { ActionButton, ModalTitle, Rates, TokenBasicDetails, TokenInputs } from "../components";
import { TokenActionsInput } from "../types";
import { useContext, useState } from "react";
import { borrow, supply } from "../../../store/tokens";
import { isRegistered, register } from "../../../store";
import { getBurrow } from "../../../utils";
import { useEffect } from "react";
import { IBurrow } from "../../../interfaces/burrow";
import { Burrow } from "../../../index";

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
	totalAmount: 0,
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
	const { title, asset, totalAmount, totalAmountTitle, buttonText, rates, ratesTitle, type } =
		input;

	const [amount, setAmount] = useState(0);
	const [registered, setRegistered] = useState(false);
	const burrow = useContext<IBurrow | null>(Burrow);

	useEffect(() => {
		(async () => {
			if (burrow?.walletConnection.isSignedIn()) {
				setRegistered(await isRegistered(burrow.account.accountId));
			}
		})();
	}, []);

	return (
		<>
			<ModalTitle title={title} />
			<TokenBasicDetails tokenName={asset.name} icon={asset.icon} apy={asset.apy} />
			<TokenInputs
				availableTokens={asset.amount}
				tokenSymbol={asset.symbol}
				tokenPriceInUSD={asset.valueInUSD}
				totalAmount={totalAmount}
				totalAmountTitle={totalAmountTitle}
				onChange={(amount) => setAmount(amount)}
			/>
			<Rates rates={rates} ratesTitle={ratesTitle} />

			{registered ? (
				<ActionButton
					text={buttonText}
					onClick={() => {
						console.log(amount, asset, type);

						if (type === "Borrow") void borrow(asset.token_id, amount);
						else void supply(asset.token_id, amount);
					}}
				/>
			) : (
				<ActionButton
					text={"Register"}
					onClick={() => {
						return register();
					}}
				/>
			)}
		</>
	);
};

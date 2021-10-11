export interface TokenActionsInput {
	title: string;
	totalAmountTitle: string;
	totalAmount: number;
	token: { count: number; name: string; symbol: string; valueInUSD: number; apy: number };
	buttonText: string;
	rates: any[];
	ratesTitle: string;
}

export enum Templates {
	TokenActions,
}

export enum Inputs {
	String,
	Switch,
}

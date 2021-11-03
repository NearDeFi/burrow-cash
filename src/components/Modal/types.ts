export type ModalType = "Borrow" | "Supply";

export interface TokenActionsInput {
	type: ModalType;
	title: string;
	totalAmountTitle: string;
	asset: {
		token_id: string;
		amount: number;
		name: string;
		symbol: string;
		valueInUSD: number;
		icon?: string;
		apy: number;
		canBeUsedAsCollateral: boolean;
	};
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

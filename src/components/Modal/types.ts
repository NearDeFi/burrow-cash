export type ModalType = "Borrow" | "Supply" | "Withdraw" | "Adjust" | "Repay";

export interface ListEntry {
  title: string;
  value: any;
  valueType?: Inputs;
  hidden?: boolean;
}

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
    collateral?: {
      balance: number;
    };
  };
  buttonText: string;
  rates?: ListEntry[];
  ratesTitle?: string;
}

export enum Templates {
  TokenActions,
}

export enum Inputs {
  String,
  Switch,
}

import { Account, Contract, WalletConnection } from "near-api-js";

export interface IBurrow {
	walletConnection: WalletConnection;
	account: Account;
	logicContract: Contract;
	oracleContract: Contract;
	view: (contract: Contract, methodName: string, args?: Object) => Object | string;
	call: (
		contract: Contract,
		methodName: string,
		args?: Object,
		deposit?: string,
	) => Object | string;
}

import { Account, Contract } from "near-api-js";
import BatchWallet from "../store/wallet";

export interface IBurrow {
	walletConnection: BatchWallet;
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

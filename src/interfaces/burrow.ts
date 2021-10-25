import { Account, Contract, WalletConnection } from "near-api-js";

export interface IBurrow {
	walletConnection: WalletConnection;
	account: Account;
	logicContract: Contract;
	oracleContract: Contract;
	view: Function;
	call: Function;
}

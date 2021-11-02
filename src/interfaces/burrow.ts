import { Account, Contract, WalletConnection } from "near-api-js";

import { IPrices } from "./oracle";
import { IMetadata, AssetEntry, IAssetDetailed } from "./asset";
import { IAccount, IAccountDetailed } from "./account";

export interface IBurrow {
	walletConnection: WalletConnection;
	account: Account;
	logicContract: Contract;
	oracleContract: Contract;
	view: (
		contract: Contract,
		methodName: string,
		args?: any,
	) => Promise<
		IPrices | IMetadata | AssetEntry[] | IAssetDetailed | IAccountDetailed | IAccount[] | string
	>;
	call: (
		contract: Contract,
		methodName: string,
		args?: Record<string, unknown>,
		deposit?: string,
	) => Promise<any>;
}

import {
	connect,
	Contract,
	keyStores,
	WalletConnection,
	ConnectedWalletAccount,
} from "near-api-js";
import getConfig, { LOGIC_CONTRACT_NAME } from "./config";
import {
	ChangeMethodsLogic,
	ChangeMethodsOracle,
	ViewMethodsLogic,
	ViewMethodsOracle,
} from "./interfaces/contract-methods";
import { IBurrow } from "./interfaces/burrow";
import BN from "bn.js";
import { getContract } from "./store/helper";

const nearConfig = getConfig(process.env.DEFAULT_NETWORK || process.env.NODE_ENV || "development");

console.log(`Using network ${nearConfig.networkId}!`);

let burrow: IBurrow;

export const getBurrow = async (): Promise<IBurrow> => {
	if (burrow) return burrow;

	// Initialize connection to the NEAR testnet
	const near = await connect(
		Object.assign(
			{
				deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
			},
			nearConfig,
		),
	);

	// Initializing Wallet based Account. It can work with NEAR testnet wallet that
	// is hosted at https://wallet.testnet.near.org
	const walletConnection = new WalletConnection(near, null);

	// Getting the Account ID. If still unauthorized, it's just empty string
	const account: ConnectedWalletAccount = new ConnectedWalletAccount(
		walletConnection,
		near.connection,
		walletConnection.account().accountId,
	);

	if (walletConnection.isSignedIn()) {
		console.log("access keys", await account.getAccessKeys());
	}

	const view = async (
		contract: Contract,
		methodName: string,
		args: Object = {},
		json: boolean = true,
	): Promise<Object | string> => {
		return await account.viewFunction(contract.contractId, methodName, args, {
			// always parse to string, JSON parser will fail if its not a json
			parse: (data: Uint8Array) => {
				const result = Buffer.from(data).toString();
				return json ? JSON.parse(result) : result;
			},
		});
	};

	const call = async (
		contract: Contract,
		methodName: string,
		args: Object = {},
		deposit: string = "1",
	) => {
		const gas = new BN(300000000000000); //new BN(7 * 10 ** 12);
		const attachedDeposit = new BN(deposit);

		console.log(
			"transaction",
			contract.contractId,
			methodName,
			args,
			attachedDeposit.toString(),
			gas.toString(),
		);

		return await account.functionCall({
			contractId: contract.contractId,
			methodName,
			args,
			attachedDeposit,
			gas,
		});
	};

	const logicContract: Contract = await getContract(
		walletConnection.account(),
		LOGIC_CONTRACT_NAME,
		ViewMethodsLogic,
		ChangeMethodsLogic,
	);

	// get oracle address from
	const config = (await view(logicContract, ViewMethodsLogic[ViewMethodsLogic.get_config])) as {
		oracle_account_id: string;
	};

	console.log("oracle address", config.oracle_account_id);

	const oracleContract: Contract = await getContract(
		walletConnection.account(),
		config.oracle_account_id,
		ViewMethodsOracle,
		ChangeMethodsOracle,
	);

	burrow = {
		walletConnection,
		account,
		logicContract,
		oracleContract,
		view,
		call,
	} as IBurrow;

	return burrow;
};

// Initialize contract & set global variables
export async function initContract() {
	return await getBurrow();
}

export function logout(walletConnection: WalletConnection) {
	walletConnection.signOut();
	// reload page
	window.location.replace(window.location.origin + window.location.pathname);
}

export async function login(walletConnection: WalletConnection) {
	// Allow the current app to make calls to the specified contract on the
	// user's behalf.
	// This works by creating a new access key for the user's account and storing
	// the private key in localStorage.
	await walletConnection.requestSignIn({
		contractId: LOGIC_CONTRACT_NAME,
	});
}

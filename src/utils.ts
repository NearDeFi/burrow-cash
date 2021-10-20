import { connect, Contract, keyStores, WalletConnection, Account } from "near-api-js";
import getConfig, {
	LOGIC_CONTRACT_NAME,
	ChangeMethodsLogic,
	ChangeMethodsOracle,
	ViewMethodsLogic,
	ViewMethodsOracle,
} from "./config";
import { IBurrow } from "./index";

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
	const account: Account = await near.account(walletConnection.getAccountId());

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

	const send = async (contract: Contract, methodName: string, args: Object = {}) => {
		return await account.functionCall({
			contractId: contract.contractId,
			methodName,
			args,
		});
	};

	const logicContract: Contract = new Contract(walletConnection.account(), LOGIC_CONTRACT_NAME, {
		// View methods are read only. They don't modify the state, but usually return some value.
		viewMethods: Object.values(ViewMethodsLogic)
			// @ts-ignore
			.filter((m) => typeof m === "string")
			.map((m) => m as string),
		// Change methods can modify the state. But you don't receive the returned value when called.
		changeMethods: Object.values(ChangeMethodsLogic)
			// @ts-ignore
			.filter((m) => typeof m === "string")
			.map((m) => m as string),
	});

	// get oracle address from
	const config = (await view(logicContract, ViewMethodsLogic[ViewMethodsLogic.get_config])) as {
		oracle_account_id: string;
	};

	const oracleContract: Contract = new Contract(
		walletConnection.account(),
		config.oracle_account_id,
		{
			// View methods are read only. They don't modify the state, but usually return some value.
			viewMethods: Object.values(ViewMethodsOracle)
				// @ts-ignore
				.filter((m) => typeof m === "string")
				.map((m) => m as string),
			// Change methods can modify the state. But you don't receive the returned value when called.
			changeMethods: Object.values(ChangeMethodsOracle)
				// @ts-ignore
				.filter((m) => typeof m === "string")
				.map((m) => m as string),
		},
	);

	burrow = {
		walletConnection,
		account,
		logicContract,
		oracleContract,
		view,
		send,
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
	await walletConnection.requestSignIn(LOGIC_CONTRACT_NAME);
}

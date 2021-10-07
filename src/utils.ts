import { connect, Contract, keyStores, WalletConnection, Account } from "near-api-js";
import getConfig, { ChangeMethods, ViewMethods } from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

// Initialize contract & set global variables
export async function initContract() {
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

	const contract: Contract = new Contract(walletConnection.account(), nearConfig.contractName, {
		// View methods are read only. They don't modify the state, but usually return some value.
		viewMethods: Object.values(ViewMethods)
			// @ts-ignore
			.filter((m) => typeof m === "string")
			.map((m) => m as string),
		// Change methods can modify the state. But you don't receive the returned value when called.
		changeMethods: Object.values(ChangeMethods)
			// @ts-ignore
			.filter((m) => typeof m === "string")
			.map((m) => m as string),
	});

	const view = async (methodName: ViewMethods, args: Object = {}) => {
		return await account.viewFunction(contract.contractId, ViewMethods[methodName], args, {
			// always parse to string, JSON parser will fail if its not a json
			parse: (a: Uint8Array) => Buffer.from(a).toString(),
		});
	};

	const send = async (methodName: ChangeMethods, args: Object = {}) => {
		return await account.functionCall({
			contractId: contract.contractId,
			methodName: ChangeMethods[methodName],
			args,
		});
	};

	/*
	await send("new", {
		config: {
			oracle_account_id: "vvs111.testnet",
			owner_id: "vvs111.testnet",
		},
	});
	*/

	// console.log(account.accountId, await account.getAccountBalance());
	// console.log(await account.state());

	return {
		walletConnection,
		account,
		contract,
		view,
		send,
	};
}

export function logout(walletConnection: WalletConnection) {
	walletConnection.signOut();
	// reload page
	window.location.replace(window.location.origin + window.location.pathname);
}

export function login(walletConnection: WalletConnection) {
	// Allow the current app to make calls to the specified contract on the
	// user's behalf.
	// This works by creating a new access key for the user's account and storing
	// the private key in localStorage.
	walletConnection.requestSignIn(nearConfig.contractName);
}

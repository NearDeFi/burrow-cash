const CONTRACT_NAME = process.env.CONTRACT_NAME || "b.vvs111.testnet";

export enum ViewMethods {
	"get_account",
	"get_accounts_paged",
	"get_asset",
	"get_assets",
	"get_assets_paged",
	"get_config",
}

// Change methods can modify the state. But you don't receive the returned value when called.
export enum ChangeMethods {
	"new",
	"execute",
	"update_config",
	"add_asset",
	"update_asset",
	"ft_on_transfer",
	"oracle_on_call",
}

const getConfig = (env: string) => {
	switch (env) {
		case "production":
		case "mainnet":
			return {
				networkId: "mainnet",
				nodeUrl: "https://rpc.mainnet.near.org",
				contractName: CONTRACT_NAME,
				walletUrl: "https://wallet.near.org",
				helperUrl: "https://helper.mainnet.near.org",
				explorerUrl: "https://explorer.mainnet.near.org",
			};
		case "development":
		case "testnet":
			return {
				networkId: "testnet",
				nodeUrl: "https://rpc.testnet.near.org",
				contractName: CONTRACT_NAME,
				walletUrl: "https://wallet.testnet.near.org",
				helperUrl: "https://helper.testnet.near.org",
				explorerUrl: "https://explorer.testnet.near.org",
			};
		case "betanet":
			return {
				networkId: "betanet",
				nodeUrl: "https://rpc.betanet.near.org",
				contractName: CONTRACT_NAME,
				walletUrl: "https://wallet.betanet.near.org",
				helperUrl: "https://helper.betanet.near.org",
				explorerUrl: "https://explorer.betanet.near.org",
			};
		case "local":
			return {
				networkId: "local",
				nodeUrl: "http://localhost:3030",
				keyPath: `${process.env.HOME}/.near/validator_key.json`,
				walletUrl: "http://localhost:4000/wallet",
				contractName: CONTRACT_NAME,
			};
		case "test":
		case "ci":
			return {
				networkId: "shared-test",
				nodeUrl: "https://rpc.ci-testnet.near.org",
				contractName: CONTRACT_NAME,
				masterAccount: "test.near",
			};
		case "ci-betanet":
			return {
				networkId: "shared-test-staging",
				nodeUrl: "https://rpc.ci-betanet.near.org",
				contractName: CONTRACT_NAME,
				masterAccount: "test.near",
			};
		default:
			throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
	}
};

export default getConfig;

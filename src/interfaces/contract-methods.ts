export enum ViewMethodsLogic {
	// accounts
	get_account,
	get_accounts_paged,
	// assets
	get_asset,
	get_assets,
	get_assets_paged,
	// config
	get_config,
	// farms
	get_asset_farm,
	get_asset_farms,
	get_asset_farms_paged,
}

// Change methods can modify the state. But you don't receive the returned value when called.
export enum ChangeMethodsLogic {
	// init
	new,
	execute,
	// config
	update_config,
	// assets
	add_asset,
	update_asset,
	ft_on_transfer,
	oracle_on_call,
	// farms
	account_farm_claim_all,
	add_asset_farm_reward,
}

export enum ViewMethodsOracle {}

// Change methods can modify the state. But you don't receive the returned value when called.
export enum ChangeMethodsOracle {}

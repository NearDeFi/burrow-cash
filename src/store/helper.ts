import Decimal from "decimal.js";
import { DEFAULT_PRECISION, NANOS_PER_YEAR } from "./constants";
import { getBurrow } from "../utils";
import { ViewMethodsOracle } from "../interfaces/contract-methods";
import { IPrices } from "../interfaces/oracle";

Decimal.set({ precision: DEFAULT_PRECISION });

export const aprToRate = (apr: string): string => {
	console.log("Input APR", apr);
	const exp = new Decimal(1).dividedBy(new Decimal(NANOS_PER_YEAR));
	const base = new Decimal(apr).dividedBy(new Decimal(100));
	const result: Decimal = base.plus(new Decimal(1)).pow(exp);
	console.log("R", result.toPrecision(DEFAULT_PRECISION));
	console.log("R ** n", result.pow(new Decimal(NANOS_PER_YEAR)).toPrecision(DEFAULT_PRECISION));

	const roundRes: Decimal = result.mul(new Decimal(10).pow(new Decimal(27)));
	console.log("rate", roundRes.toPrecision(12));
	return roundRes.toPrecision(12);
};

aprToRate("1000000000003593629036885046");
aprToRate("25");

export const getPrices = async (tokenIds: string[]): Promise<IPrices | undefined> => {
	const burrow = await getBurrow();

	try {
		const prices: IPrices = await burrow?.view(
			burrow?.oracleContract,
			ViewMethodsOracle[ViewMethodsOracle.get_price_data],
			{
				asset_ids: tokenIds,
			},
		);

		console.log("prices", prices);

		return prices;
	} catch (err: any) {
		console.log("Getting prices failed: ", err.message);
	}
};

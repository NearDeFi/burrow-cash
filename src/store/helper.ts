import Decimal from "decimal.js";
import { DEFAULT_PRECISION, NANOS_PER_YEAR } from "./constants";

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

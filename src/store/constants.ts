export const NANOS_PER_YEAR = 31536000000;
export const DEFAULT_PRECISION = 60;
export const TOKEN_DECIMALS = 18;
export const NEAR_DECIMALS = 24;
export const PERCENT_DIGITS = 0; // Decrease APY decimals to the thousandth #111

export const USD_FORMAT = {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
};

export const TOKEN_FORMAT = {
  style: "decimal",
  minimumFractionDigits: PERCENT_DIGITS,
  maximumFractionDigits: PERCENT_DIGITS,
};

export const NUMBER_FORMAT = {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export const APY_FORMAT = {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const DUST_FORMAT = {
  style: "decimal",
  minimumFractionDigits: 6,
  maximumFractionDigits: 6,
};

export const NO_STORAGE_DEPOSIT_CONTRACTS = ["aurora", "meta-pool.near"];
export const STORAGE_DEPOSIT_FEE = process.env.STORAGE_DEPOSIT_FEE || 0.15;
export const NEAR_STORAGE_DEPOSIT = 0.25;

export const isBeta = process.env.CONTRACT_NAME === "contract.beta.burrow.near";
export const isMain = process.env.CONTRACT_NAME === "contract.main.burrow.near";

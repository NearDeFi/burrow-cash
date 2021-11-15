export const NANOS_PER_YEAR = 31536000000;
export const DEFAULT_PRECISION = 60;
export const TOKEN_DECIMALS = 18;
export const NEAR_DECIMALS = 24;
export const PERCENT_DIGITS = 3; // Decrease APY decimals to the thousandth #111

export const USD_FORMAT = {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
};

export const TOKEN_FORMAT = {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const DECIMAL_OVERRIDES = {
  wNEAR: NEAR_DECIMALS,
};

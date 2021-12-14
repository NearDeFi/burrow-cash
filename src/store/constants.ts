export const NANOS_PER_YEAR = 31536000000;
export const DEFAULT_PRECISION = 60;
export const TOKEN_DECIMALS = 18;
export const NEAR_DECIMALS = 24;
export const PERCENT_DIGITS = 4; // Decrease APY decimals to the thousandth #111

export const MAX_RATIO = 10000;
export const NUM_DECIMALS = 27;

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

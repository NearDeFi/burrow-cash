import Decimal from "decimal.js";
import millify from "millify";

export const NANOS_PER_YEAR = 31536000000;
export const DEFAULT_PRECISION = 60;
export const TOKEN_DECIMALS = 18;
export const NEAR_DECIMALS = 24;
export const PERCENT_DIGITS = 4; // Decrease APY decimals to the thousandth #111
export const MAX_RATIO = 10000;

export const USD_FORMAT = {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
};

export const COMPACT_USD_FORMAT = {
  ...USD_FORMAT,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
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
export const NEAR_STORAGE_DEPOSIT = Number(process.env.NEAR_STORAGE_DEPOSIT) || 0.25;
export const NEAR_STORAGE_DEPOSIT_MIN = 0.05;
export const NEAR_STORAGE_EXTRA_DEPOSIT = 0.1;

export const NEAR_STORAGE_DEPOSIT_DECIMAL = new Decimal(NEAR_STORAGE_DEPOSIT).mul(
  new Decimal(10).pow(NEAR_DECIMALS),
);

export const CONTRACT_MAIN = "contract.main.burrow.near";
export const CONTRACT_BETA = "contract.beta.burrow.near";

export const isBeta = process.env.CONTRACT_NAME === CONTRACT_BETA;
export const isMain = process.env.CONTRACT_NAME === CONTRACT_MAIN;

export const m = (a) => millify(a, { precision: 2 });

export const NEAR_LOGO_SVG = `<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="17.5" cy="17.5" r="17.5" fill="white"/>
<path d="M24.0266 9.02222L19.8535 15.2222C19.5649 15.6444 20.1199 16.1556 20.5194 15.8L24.626 12.2222C24.737 12.1333 24.8923 12.2 24.8923 12.3556V23.5333C24.8923 23.6889 24.6926 23.7556 24.6038 23.6444L12.1731 8.75556C11.7736 8.26667 11.1964 8 10.5527 8H10.1088C8.9545 8 8 8.95556 8 10.1333V25.8667C8 27.0444 8.9545 28 10.131 28C10.8635 28 11.5516 27.6222 11.9512 26.9778L16.1243 20.7778C16.4129 20.3556 15.8579 19.8444 15.4584 20.2L11.3518 23.7556C11.2408 23.8444 11.0855 23.7778 11.0855 23.6222V12.4667C11.0855 12.3111 11.2852 12.2444 11.374 12.3556L23.8047 27.2444C24.2042 27.7333 24.8036 28 25.4251 28H25.869C27.0455 28 28 27.0444 28 25.8667V10.1333C28 8.95556 27.0455 8 25.869 8C25.1143 8 24.4262 8.37778 24.0266 9.02222Z" fill="black"/>
</svg>
`;

import { createSelector } from "@reduxjs/toolkit";
import { shrinkToken } from "../../store";
import { RootState } from "../store";

export const getStaking = createSelector(
  (state: RootState) => state.account,
  (state: RootState) => state.app,
  (account, app) => {
    const { config } = app;
    const { amount, months } = app.staking;

    const BRRR = Number(
      shrinkToken(account.portfolio.staking["staked_booster_amount"], app.config.booster_decimals),
    );
    const xBRRR = Number(
      shrinkToken(account.portfolio.staking["x_booster_amount"], app.config.booster_decimals),
    );

    const stakingTimestamp = Number(account.portfolio.staking["unlock_timestamp"]);

    const xBRRRMultiplier =
      1 +
      ((months * config.minimum_staking_duration_sec - config.minimum_staking_duration_sec) /
        (config.maximum_staking_duration_sec - config.minimum_staking_duration_sec)) *
        (config.x_booster_multiplier_at_maximum_staking_duration / 10000 - 1);

    const totalXBRRR = Math.max(
      xBRRR + amount * xBRRRMultiplier,
      (BRRR + amount) * xBRRRMultiplier,
    );

    const extraXBRRRAmount = totalXBRRR - xBRRR;

    return {
      BRRR,
      xBRRR,
      extraXBRRRAmount,
      totalXBRRR,
      stakingTimestamp,
      amount,
      months,
    };
  },
);

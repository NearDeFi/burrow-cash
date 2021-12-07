import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IBalance } from "../interfaces";

export interface AssetsState {
  [id: string]: IBalance;
}

const initialState: AssetsState = {};

export const balancesSlice = createSlice({
  name: "balances",
  initialState,
  reducers: {
    receivedBalances(state, action: PayloadAction<IBalance[]>) {
      const balances = action.payload;
      balances.forEach((balance) => {
        state[balance.token_id] = balance;
      });
    },
  },
});

export const { receivedBalances } = balancesSlice.actions;
export default balancesSlice.reducer;

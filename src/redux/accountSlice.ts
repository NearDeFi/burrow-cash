import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Balance {
  [id: string]: string;
}

export interface AccountState {
  balances?: Balance;
}

const initialState: AccountState = {
  balances: undefined,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    receivedAccount(state, action: PayloadAction<{ balances: Balance }>) {
      const { balances } = action.payload;
      state.balances = balances;
    },
  },
});

export const { receivedAccount } = accountSlice.actions;
export default accountSlice.reducer;

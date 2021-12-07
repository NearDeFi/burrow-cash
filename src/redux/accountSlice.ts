import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Balance {
  [tokenId: string]: string;
}

interface PortfolioAsset {
  apr: string;
  balance: string;
  shares: string;
}

interface Portfolio {
  supplied: {
    [tokenId: string]: PortfolioAsset;
  };
  collateral: {
    [tokenId: string]: PortfolioAsset;
  };
  borrowed: {
    [tokenId: string]: PortfolioAsset;
  };
}
export interface AccountState {
  accountId?: string;
  balances?: Balance;
  portfolio?: Portfolio;
}

const initialState: AccountState = {
  accountId: undefined,
  balances: undefined,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    receivedAccount(
      state,
      action: PayloadAction<{ accountId: string; balances: Balance; portfolio: Portfolio }>,
    ) {
      const { accountId, balances, portfolio } = action.payload;
      state.accountId = accountId;
      state.balances = balances;
      state.portfolio = portfolio;
    },
  },
});

export const { receivedAccount } = accountSlice.actions;
export default accountSlice.reducer;

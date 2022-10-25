import { initialState as appInitialState } from "./appSlice";
import { initialState as accountInitialState } from "./accountState";

export const migrations = {
  0: (state) => state,
  1: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        tableSorting: appInitialState.tableSorting,
      },
    };
  },
  2: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        showDailyReturns: false,
        fullDigits: appInitialState.fullDigits,
      },
    };
  },
  3: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        staking: appInitialState.staking,
      },
    };
  },
  4: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        degenMode: appInitialState.degenMode,
      },
    };
  },
  5: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        protocolStats: true,
        showInfo: true,
      },
      account: {
        ...state.account,
        portfolio: accountInitialState.portfolio,
      },
      assets: {
        ...state.assets,
        netTvlFarm: {},
      },
    };
  },
  6: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        disclaimerAgreed: false,
      },
    };
  },
  7: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        isBlocked: undefined,
      },
    };
  },
  8: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        isBlocked: {},
      },
    };
  },
  9: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        theme: "light",
      },
    };
  },
};

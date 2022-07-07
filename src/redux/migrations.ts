import { initialState } from "./appSlice";

export const migrations = {
  0: (state) => state,
  1: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        tableSorting: initialState.tableSorting,
      },
    };
  },
  2: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        showDailyReturns: false,
        fullDigits: initialState.fullDigits,
      },
    };
  },
  3: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        staking: initialState.staking,
      },
    };
  },
  4: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        degenMode: initialState.degenMode,
      },
    };
  },
  5: (state) => {
    return {
      ...state,
      app: {
        ...state.app,
        protocolStats: true,
      },
    };
  },
};

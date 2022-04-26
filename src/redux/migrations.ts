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
};

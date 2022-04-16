import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";

interface FeedEvent {
  blockHash: number;
  timestamp: number;
  event: string;
  data: {
    accountId: string;
    amount: string;
    tokenId: string;
  };
  receiptId: string;
}

export interface FeedState {
  events: FeedEvent[];
}

const initialState: FeedState = {
  events: [],
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    updateFeed(state, action: PayloadAction<{ events: FeedEvent[] }>) {
      // console.log("ACT:", action);
      state.events = uniqBy(state.events.concat(action.payload.events), "blockHash");
    },
  },
});

export const { updateFeed } = feedSlice.actions;

export default feedSlice.reducer;

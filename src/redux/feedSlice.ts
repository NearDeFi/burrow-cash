import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uniqBy, orderBy } from "lodash";

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
      state.events = uniqBy(state.events.concat(action.payload.events), "receiptId");
    },
    orderFeed(state) {
      state.events = orderBy(state.events, ["timestamp"], ["desc"]);
    },
  },
});

export const { updateFeed, orderFeed } = feedSlice.actions;

export default feedSlice.reducer;

import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "./store";

export const getFeedEvents = createSelector(
  (state: RootState) => state.feed,
  (feed) => feed.events,
);

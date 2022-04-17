import { useEffect } from "react";

import { CONTRACT_MAIN } from "../../store/constants";
import { updateFeed } from "../../redux/feedSlice";
import { useAppDispatch } from "../../redux/hooks";
import { keysToCamel } from "./utils";

const defaultBurrowFilter = {
  status: "SUCCESS",
  account_id: CONTRACT_MAIN,
  event: {
    standard: "burrow",
  },
};
const burrowFilter = JSON.parse(JSON.stringify(defaultBurrowFilter));

let reconnectTimeout;
let ws;

function listenToBurrow(processEvents) {
  const scheduleReconnect = (timeOut) => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = 0;
    }
    reconnectTimeout = window.setTimeout(() => {
      listenToBurrow(processEvents);
    }, timeOut);
  };

  if (document.hidden) {
    scheduleReconnect(1000);
    return;
  }

  if (ws) {
    ws.close();
    return;
  }

  ws = new WebSocket("wss://events.near.stream/ws");

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        secret: "brrr",
        filter: burrowFilter,
        fetch_past_events: 50,
      }),
    );
  };
  ws.onclose = () => {
    ws = null;
    scheduleReconnect(1);
  };
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    processEvents(data.events);
  };
  ws.onerror = (err) => {
    ws = null;
    console.error("WebSocket error", err);
  };
}

function processEvent(event) {
  return {
    blockHash: event.blockHash,
    timestamp: event.blockTimestamp,
    event: event.event.event,
    data: event.event.data[0],
    receiptId: event.receiptId,
  };
}

function FeedData() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const processEvents = (events) => {
      events = events.map(keysToCamel).flatMap(processEvent);
      events.reverse();
      dispatch(updateFeed({ events }));
    };

    listenToBurrow(processEvents);
  }, []);

  return null;
}

export default FeedData;

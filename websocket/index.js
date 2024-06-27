import { store } from "../store";
import {
  setBids,
  setAsks,
  setConnected,
  setPrecision,
} from "../store/orderBookSlice";

let ws;

const subscribeToBook = (precision) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        event: "unsubscribe",
        channel: "book",
        symbol: "tBTCUSD",
      })
    );

    ws.send(
      JSON.stringify({
        event: "subscribe",
        channel: "book",
        symbol: "tBTCUSD",
        prec: `P${precision}`, // Adjust precision dynamically
        freq: "F0",
        len: 25,
      })
    );
  }
};

export const connectWebSocket = () => {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  ws = new WebSocket("wss://api-pub.bitfinex.com/ws/2");

  ws.onopen = () => {
    console.log("WebSocket connected");
    store.dispatch(setConnected(true));
    const precision = store.getState().orderBook.precision;
    subscribeToBook(precision);
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (Array.isArray(data[1])) {
      const [price, count, amount] = data[1];
      if (count > 0) {
        if (amount > 0) {
          store.dispatch(
            setBids((prevBids) => [...prevBids, { price, amount }])
          );
        } else {
          store.dispatch(
            setAsks((prevAsks) => [...prevAsks, { price, amount: -amount }])
          );
        }
      }
    }
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
    store.dispatch(setConnected(false));
  };
};

export const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};

export const updatePrecision = (newPrecision) => {
  store.dispatch(setPrecision(newPrecision));
  if (ws && ws.readyState === WebSocket.OPEN) {
    subscribeToBook(newPrecision);
  }
};

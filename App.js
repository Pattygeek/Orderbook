import React from "react";
import { Provider } from "react-redux";

import { store } from "./store";
import OrderBook from "./components/OrderBook";

export default function App() {
  return (
    <Provider store={store}>
      <OrderBook />
    </Provider>
  );
}

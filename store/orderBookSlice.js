import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bids: [],
  asks: [],
  connected: false,
  precision: 0,
  scaling: 1,
};

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    setBids: (state, action) => {
      state.bids = action.payload;
    },
    setAsks: (state, action) => {
      state.asks = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setPrecision: (state, action) => {
      state.precision = action.payload;
    },
    setScaling: (state, action) => {
      state.scaling = action.payload;
    },
  },
});

export const { setBids, setAsks, setConnected, setPrecision, setScaling } =
  orderBookSlice.actions;

export default orderBookSlice.reducer;

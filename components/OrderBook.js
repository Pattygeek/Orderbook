import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import {
  connectWebSocket,
  disconnectWebSocket,
  updatePrecision,
} from "../websocket";
import { setScaling } from "../store/orderBookSlice";

const OrderBook = () => {
  const dispatch = useDispatch();
  const { bids, asks, connected, precision, scaling } = useSelector(
    (state) => state.orderBook
  );

  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleConnect = useCallback(() => {
    connectWebSocket();
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnectWebSocket();
  }, []);

  const handlePrecisionChange = useCallback((newPrecision) => {
    updatePrecision(newPrecision);
  }, []);

  const renderItem = ({ item }) => {
    if (!item || item.amount === undefined || item.price === undefined)
      return null;
    return (
      <View style={[styles.row]}>
        <Text style={styles.text}>{Math.abs(item?.amount)}</Text>
        <Text style={styles.text}>{item?.price}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="Connect" onPress={handleConnect} disabled={connected} />
        <Button
          title="Disconnect"
          onPress={handleDisconnect}
          disabled={!connected}
        />
      </View>
      <View>
        <Text style={styles.title}>Order Book</Text>
      </View>
      <View style={styles.depthBars}>
        <FlatList
          data={bids}
          renderItem={renderItem}
          keyExtractor={(item, index) => `bid-${index}`}
        />
        <FlatList
          data={asks}
          renderItem={renderItem}
          keyExtractor={(item, index) => `ask-${index}`}
        />
      </View>
      <View style={styles.controls}>
        <Button
          title="Increase Precision"
          onPress={() => handlePrecisionChange(precision + 1)}
        />
        <Button
          title="Decrease Precision"
          onPress={() => handlePrecisionChange(precision - 1)}
        />
      </View>
      <View style={styles.controls}>
        <Button
          title="Increase Scaling"
          onPress={() => dispatch(setScaling(scaling + 1))}
        />
        <Button
          title="Decrease Scaling"
          onPress={() => dispatch(setScaling(scaling - 1))}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#000",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  depthBars: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  text: {
    color: "#fff",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default OrderBook;

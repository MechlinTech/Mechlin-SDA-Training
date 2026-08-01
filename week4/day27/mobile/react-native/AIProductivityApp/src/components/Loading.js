import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";

export default function Loading({
  message = "Loading...",
}) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#2563EB"
      />

      <Text style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  text: {
    marginTop: 15,
    fontSize: 16,
    color: "#6B7280",
  },
});
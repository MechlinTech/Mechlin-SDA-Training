import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function EmptyState({
  title = "No Data Found",
  subtitle = "Nothing to display.",
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📭</Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },

  icon: {
    fontSize: 55,
    marginBottom: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#374151",
  },

  subtitle: {
    marginTop: 8,
    color: "#6B7280",
    textAlign: "center",
    fontSize: 15,
  },
});
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function Button({
  title,
  onPress,
  color = "#2563EB",
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled
            ? "#9CA3AF"
            : color,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
  },

  text: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
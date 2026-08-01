import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function ChatBubble({
  sender,
  message,
}) {
  const isUser = sender === "user";

  return (
    <View
      style={[
        styles.container,
        isUser
          ? styles.userContainer
          : styles.aiContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? styles.userBubble
            : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isUser
              ? styles.userText
              : styles.aiText,
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flexDirection: "row",
  },

  userContainer: {
    justifyContent: "flex-end",
  },

  aiContainer: {
    justifyContent: "flex-start",
  },

  bubble: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 18,
  },

  userBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 5,
  },

  aiBubble: {
    backgroundColor: "#E5E7EB",
    borderBottomLeftRadius: 5,
  },

  text: {
    fontSize: 16,
    lineHeight: 22,
  },

  userText: {
    color: "#FFF",
  },

  aiText: {
    color: "#111827",
  },
});
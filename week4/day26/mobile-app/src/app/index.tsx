import React from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>AI Mobile Assistant</Text>

      <Text style={styles.subtitle}>Choose a feature</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/chat")}
      >
        <Text style={styles.buttonText}>🤖 AI Chatbot</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/generator")}
      >
        <Text style={styles.buttonText}>✍️ Content Generator</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/recommendations")}
      >
        <Text style={styles.buttonText}>🎯 Recommendations</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F5F5F5",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4F46E5",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 18,
    color: "#666666",
    marginBottom: 40,
  },

  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

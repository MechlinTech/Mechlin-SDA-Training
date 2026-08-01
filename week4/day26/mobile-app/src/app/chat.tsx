import React from "react";

import {
  SafeAreaView,
  StyleSheet,
} from "react-native";

import ReactNativeAIChatbot from "../components/ReactNativeAIChatbot";

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ReactNativeAIChatbot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
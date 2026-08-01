import React from "react";

import {
  SafeAreaView,
  StyleSheet,
} from "react-native";

import MobileAIContentGenerator from "../components/MobileAIContentGenerator";

export default function GeneratorScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <MobileAIContentGenerator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
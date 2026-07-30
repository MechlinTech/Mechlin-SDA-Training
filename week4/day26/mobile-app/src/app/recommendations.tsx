import React from "react";

import {
  SafeAreaView,
  StyleSheet,
} from "react-native";

import MobileAIRecommendations from "../components/MobileAIRecommendations";

export default function RecommendationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <MobileAIRecommendations />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
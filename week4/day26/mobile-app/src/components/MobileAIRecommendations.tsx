import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import api from "../services/api";

type Recommendation = string;

const MobileAIRecommendations: React.FC = () => {
  const [interests, setInterests] = useState("");
  const [experience, setExperience] = useState("");
  const [goal, setGoal] = useState("");

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    if (!interests.trim() || !experience.trim() || !goal.trim()) {
      Alert.alert("Validation", "Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.getRecommendations({
        interests: interests.split(",").map((item) => item.trim()),
        experience,
        goal,
      });

      setRecommendations(response.recommendations ?? []);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>AI Recommendations</Text>

      <TextInput
        style={styles.input}
        placeholder="Interests (comma separated)"
        value={interests}
        onChangeText={setInterests}
      />

      <TextInput
        style={styles.input}
        placeholder="Experience Level"
        value={experience}
        onChangeText={setExperience}
      />

      <TextInput
        style={styles.input}
        placeholder="Your Goal"
        value={goal}
        onChangeText={setGoal}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={getRecommendations}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Get Recommendations</Text>
        )}
      </TouchableOpacity>

      {recommendations.length > 0 && (
        <View style={styles.resultContainer}>
          {recommendations.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>
                Recommendation {index + 1}
              </Text>

              <Text style={styles.cardDescription}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  contentContainer: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4F46E5",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 25,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  resultContainer: {
    marginTop: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 10,
  },

  cardDescription: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
  },
});

export default MobileAIRecommendations;
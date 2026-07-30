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

interface GeneratedContent {
  title: string;
  content: string;
}

const MobileAIContentGenerator: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("article");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");

  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);

  const [loading, setLoading] = useState(false);
  const generateContent = async () => {
    if (!topic.trim()) {
      Alert.alert("Validation", "Please enter a topic.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.generateContent({
        content_type: contentType,
        topic: topic.trim(),
        tone,
        length,
        keywords: [],
      });

      setGeneratedContent({
        title: topic.trim(),
        content:
          response.content ??
          response.generated_content ??
          "No content generated.",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to generate content.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>AI Content Generator</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Topic"
        value={topic}
        onChangeText={setTopic}
      />

      <Text style={styles.label}>Content Type</Text>

      <TextInput
        style={styles.input}
        value={contentType}
        onChangeText={setContentType}
        placeholder="article, blog, email..."
      />

      <Text style={styles.label}>Tone</Text>

      <TextInput
        style={styles.input}
        value={tone}
        onChangeText={setTone}
        placeholder="professional, friendly..."
      />

      <Text style={styles.label}>Length</Text>

      <TextInput
        style={styles.input}
        value={length}
        onChangeText={setLength}
        placeholder="short, medium, long"
      />

      <TouchableOpacity
        style={styles.generateButton}
        onPress={generateContent}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.generateButtonText}>Generate Content</Text>
        )}
      </TouchableOpacity>

      {generatedContent && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>{generatedContent.title}</Text>

          <Text style={styles.resultContent}>{generatedContent.content}</Text>
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
    marginBottom: 20,
    textAlign: "center",
    color: "#4F46E5",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 15,
    color: "#333333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },

  generateButton: {
    marginTop: 25,
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  generateButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  resultContainer: {
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 18,
    elevation: 2,
  },

  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#4F46E5",
  },

  resultContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
  },
});

export default MobileAIContentGenerator;

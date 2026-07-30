import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../services/api";

import { STORAGE_KEYS, APP_CONFIG } from "../constants/config";

import { ChatMessage } from "../types/chat";

interface ReactNativeAIChatbotProps {
  apiUrl?: string;
  theme?: "light" | "dark";
  maxMessages?: number;
}

const ReactNativeAIChatbot: React.FC<ReactNativeAIChatbotProps> = ({
  apiUrl,
  theme = "light",
  maxMessages = APP_CONFIG.MAX_MESSAGES,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    saveMessages();
  }, [messages]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({
      animated: true,
    });
  }, [messages]);
  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(
        STORAGE_KEYS.CHAT_MESSAGES,
      );

      if (storedMessages) {
        const parsedMessages: ChatMessage[] = JSON.parse(storedMessages).map(
          (message: any) => ({
            ...message,
            timestamp: new Date(message.timestamp),
          }),
        );

        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CHAT_MESSAGES,
        JSON.stringify(messages),
      );
    } catch (error) {
      console.error("Failed to save messages:", error);
    }
  };
  const sendMessage = async () => {
    const message = inputText.trim();

    if (!message || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage].slice(-maxMessages);

    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);

    try {
      const conversationHistory = updatedMessages.map((item) => item.text);

      const response = await api.chat(message, conversationHistory);

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response ?? "No response received.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((previousMessages) =>
        [...previousMessages, botMessage].slice(-maxMessages),
      );
    } catch (error) {
      Alert.alert("Error", "Unable to connect to the AI service.");
    } finally {
      setLoading(false);
    }
  };
  const clearChat = () => {
    Alert.alert("Clear Chat", "Are you sure you want to delete all messages?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);

            setMessages([]);
          } catch (error) {
            console.error("Failed to clear messages:", error);
          }
        },
      },
    ]);
  };

  const renderMessage = (message: ChatMessage) => {
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        <Text style={styles.messageText}>{message.text}</Text>

        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Chatbot</Text>

        <TouchableOpacity onPress={clearChat}>
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {messages.map(renderMessage)}

        {loading && (
          <View style={[styles.messageContainer, styles.botMessage]}>
            <Text style={styles.messageText}>AI is typing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#4F46E5",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  clearButton: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },

  chatContainer: {
    flex: 1,
  },

  chatContent: {
    padding: 16,
  },

  messageContainer: {
    maxWidth: "80%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4F46E5",
  },

  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
  },

  messageText: {
    fontSize: 16,
    color: "#000000",
  },

  timestamp: {
    marginTop: 6,
    fontSize: 11,
    color: "#666666",
    alignSelf: "flex-end",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,
    minHeight: 45,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
  },

  sendButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ReactNativeAIChatbot;

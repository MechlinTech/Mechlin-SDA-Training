import React, {
    useState,
  } from "react";
  
  import {
    View,
    FlatList,
    StyleSheet,
    Alert,
  } from "react-native";
  
  import Header from "../components/Header";
  import Input from "../components/Input";
  import Button from "../components/Button";
  import Loading from "../components/Loading";
  import ChatBubble from "../components/ChatBubble";
  
  import { sendMessage } from "../services/ai.service";
  import { getToken } from "../utils/storage";
  
  export default function AIChatScreen() {
    const [prompt, setPrompt] = useState("");
  
    const [messages, setMessages] = useState([]);
  
    const [loading, setLoading] =
      useState(false);
  
    const handleSend = async () => {
      if (!prompt.trim()) {
        Alert.alert(
          "Validation",
          "Please enter your question."
        );
        return;
      }
  
      const userMessage = {
        id: Date.now().toString(),
        sender: "user",
        message: prompt,
      };
  
      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);
  
      try {
        setLoading(true);
  
        const token = await getToken();
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const response =
          await sendMessage(
            prompt,
            config
          );
  
        const aiMessage = {
          id: (
            Date.now() + 1
          ).toString(),
  
          sender: "ai",
  
          message:
            response.data ||
            response.response ||
            "No response received.",
        };
  
        setMessages((prev) => [
          ...prev,
          aiMessage,
        ]);
  
        setPrompt("");
      } catch (error) {
        Alert.alert(
          "AI Error",
          "Unable to connect with AI."
        );
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <Header
          title="AI Assistant"
          subtitle="Ask anything..."
        />
  
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              sender={item.sender}
              message={item.message}
            />
          )}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
  
        {loading && (
          <Loading message="AI is thinking..." />
        )}
  
        <Input
          placeholder="Ask Gemini AI..."
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
  
        <Button
          title="Send"
          onPress={handleSend}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F7FA",
      padding: 20,
    },
  });
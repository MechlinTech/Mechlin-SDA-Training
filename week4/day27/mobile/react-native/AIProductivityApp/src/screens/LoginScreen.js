import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
} from "react-native";

import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import Loading from "../components/Loading";

import { login as loginService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Validation",
        "Please fill all fields."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await loginService(
        email,
        password
      );

      const token =
        response.token ||
        response.data?.token;

      await login(token);

      navigation.replace("Dashboard");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message ||
          "Invalid credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Logging in..." />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="AI Productivity"
        subtitle="Login to continue"
      />

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Login"
        onPress={handleLogin}
      />

      <Button
        title="Create Account"
        color="#10B981"
        onPress={() =>
          navigation.navigate("Register")
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    padding: 25,
  },
});
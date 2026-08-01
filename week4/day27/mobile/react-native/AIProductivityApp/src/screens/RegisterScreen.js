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

import { register as registerService } from "../services/auth.service";

export default function RegisterScreen({
  navigation,
}) {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert(
        "Validation",
        "Please fill all fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Validation",
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await registerService(
        name,
        email,
        password
      );

      Alert.alert(
        "Success",
        "Registration Successful"
      );

      navigation.replace("Login");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading message="Creating Account..." />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Create Account"
        subtitle="Register to continue"
      />

      <Input
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
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

      <Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button
        title="Register"
        onPress={handleRegister}
      />

      <Button
        title="Back to Login"
        color="#6B7280"
        onPress={() =>
          navigation.replace("Login")
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
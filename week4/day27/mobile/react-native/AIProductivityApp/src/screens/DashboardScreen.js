import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";

import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function DashboardScreen({ navigation }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            navigation.replace("Login");
          },
        },
      ]
    );
  };

  const DashboardCard = ({
    title,
    subtitle,
    color,
    onPress,
  }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: color },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.cardTitle}>
        {title}
      </Text>

      <Text style={styles.cardSubtitle}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Header
        title="Dashboard"
        subtitle="Welcome to AI Productivity App"
      />

      <DashboardCard
        title="📋 Task Management"
        subtitle="Create, Edit & Delete Tasks"
        color="#2563EB"
        onPress={() =>
          navigation.navigate("Tasks")
        }
      />

      <DashboardCard
        title="📊 Analytics"
        subtitle="View Productivity Report"
        color="#10B981"
        onPress={() =>
          navigation.navigate("Analytics")
        }
      />

      <DashboardCard
        title="🤖 AI Assistant"
        subtitle="Ask Gemini AI Anything"
        color="#F59E0B"
        onPress={() =>
          navigation.navigate("AIChat")
        }
      />

      <DashboardCard
        title="🚪 Logout"
        subtitle="Sign Out"
        color="#EF4444"
        onPress={handleLogout}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },

  card: {
    borderRadius: 15,
    padding: 22,
    marginBottom: 18,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },

  cardSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#FFF",
  },
});
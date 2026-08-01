import React, {
    useEffect,
    useState,
  } from "react";
  
  import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
  } from "react-native";
  
  import Header from "../components/Header";
  import Loading from "../components/Loading";
  import EmptyState from "../components/EmptyState";
  import StatCard from "../components/StatCard";
  
  import { getAnalytics } from "../services/analytics.service";
  import { getToken } from "../utils/storage";
  
  export default function AnalyticsScreen() {
    const [analytics, setAnalytics] =
      useState(null);
  
    const [loading, setLoading] =
      useState(true);
  
    const loadAnalytics = async () => {
      try {
        setLoading(true);
  
        const token = await getToken();
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const data =
          await getAnalytics(config);
  
        setAnalytics(data.data);
      } catch (error) {
        Alert.alert(
          "Error",
          "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      loadAnalytics();
    }, []);
  
    if (loading) {
      return (
        <Loading message="Loading Analytics..." />
      );
    }
  
    if (!analytics) {
      return (
        <EmptyState
          title="No Analytics"
          subtitle="No statistics available."
        />
      );
    }
  
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Analytics"
          subtitle="Your productivity report"
        />
  
        <StatCard
          title="Total Tasks"
          value={analytics.totalTasks}
          color="#2563EB"
        />
  
        <StatCard
          title="Completed Tasks"
          value={
            analytics.completedTasks
          }
          color="#10B981"
        />
  
        <StatCard
          title="Pending Tasks"
          value={analytics.pendingTasks}
          color="#F59E0B"
        />
  
        <StatCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          color="#7C3AED"
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
  });
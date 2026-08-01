import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import Button from "./Button";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {task.title}
      </Text>

      {task.description ? (
        <Text style={styles.description}>
          {task.description}
        </Text>
      ) : null}

      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.status,
            {
              color: task.completed
                ? "#10B981"
                : "#F59E0B",
            },
          ]}
        >
          {task.completed
            ? "Completed"
            : "Pending"}
        </Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.button}>
          <Button
            title="Edit"
            color="#F59E0B"
            onPress={() => onEdit(task)}
          />
        </View>

        <View style={styles.button}>
          <Button
            title="Delete"
            color="#EF4444"
            onPress={() => onDelete(task._id)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 14,
  },

  statusContainer: {
    marginTop: 12,
  },

  status: {
    fontWeight: "bold",
    fontSize: 14,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
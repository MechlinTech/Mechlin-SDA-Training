import React, {
    useEffect,
    useState,
  } from "react";
  
  import {
    View,
    StyleSheet,
    Alert,
    FlatList,
  } from "react-native";
  
  import Header from "../components/Header";
  import Input from "../components/Input";
  import Button from "../components/Button";
  import Loading from "../components/Loading";
  import EmptyState from "../components/EmptyState";
  import TaskCard from "../components/TaskCard";
  
  import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
  } from "../services/task.service";
  
  import { getToken } from "../utils/storage";
  import { useTasks } from "../context/TaskContext";
  
  export default function TasksScreen() {
    const {
      tasks,
      setTasks,
    } = useTasks();
  
    const [title, setTitle] = useState("");
  
    const [editingId, setEditingId] =
      useState(null);
  
    const [loading, setLoading] =
      useState(true);
  
    const getConfig = async () => {
      const token = await getToken();
  
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    };
  
    const loadTasks = async () => {
      try {
        setLoading(true);
  
        const config = await getConfig();
  
        const data = await getTasks(config);
  
        setTasks(data.data || []);
      } catch (error) {
        Alert.alert(
          "Error",
          "Unable to fetch tasks."
        );
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      loadTasks();
    }, []);
  
    const handleAddTask = async () => {
      if (!title.trim()) {
        Alert.alert(
          "Validation",
          "Please enter a task."
        );
        return;
      }
  
      try {
        const config = await getConfig();
  
        await createTask(
          {
            title,
          },
          config
        );
  
        setTitle("");
  
        loadTasks();
      } catch (error) {
        Alert.alert(
          "Error",
          "Unable to create task."
        );
      }
    };
  
    const handleDelete = async (id) => {
      Alert.alert(
        "Delete Task",
        "Are you sure?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const config =
                  await getConfig();
  
                await deleteTask(
                  id,
                  config
                );
  
                loadTasks();
              } catch (error) {
                Alert.alert(
                  "Error",
                  "Unable to delete."
                );
              }
            },
          },
        ]
      );
    };
  
    const handleEdit = (task) => {
      setEditingId(task._id);
  
      setTitle(task.title);
    };
  
    const handleUpdate = async () => {
      if (!editingId) return;
  
      try {
        const config = await getConfig();
  
        await updateTask(
          editingId,
          {
            title,
          },
          config
        );
  
        setEditingId(null);
  
        setTitle("");
  
        loadTasks();
      } catch (error) {
        Alert.alert(
          "Error",
          "Unable to update task."
        );
      }
    };
  
    if (loading) {
      return (
        <Loading message="Loading Tasks..." />
      );
    }
  
    return (
      <View style={styles.container}>
        <Header
          title="Tasks"
          subtitle="Manage your daily work"
        />
  
        <Input
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
        />
  
        <Button
          title={
            editingId
              ? "Update Task"
              : "Add Task"
          }
          onPress={
            editingId
              ? handleUpdate
              : handleAddTask
          }
        />
  
        {tasks.length === 0 ? (
          <EmptyState
            title="No Tasks"
            subtitle="Create your first task."
          />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) =>
              item._id
            }
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                onEdit={handleEdit}
                onDelete={
                  handleDelete
                }
              />
            )}
            showsVerticalScrollIndicator={
              false
            }
          />
        )}
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
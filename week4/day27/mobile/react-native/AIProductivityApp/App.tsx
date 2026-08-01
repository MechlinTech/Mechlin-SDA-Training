import React from "react";

import { AuthProvider } from "./src/context/AuthContext";
import { TaskProvider } from "./src/context/TaskContext";

import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppNavigator />
      </TaskProvider>
    </AuthProvider>
  );
}
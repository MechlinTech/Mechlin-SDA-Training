import React, {
    createContext,
    useContext,
    useState,
  } from "react";
  
  const TaskContext = createContext();
  
  export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
  
    const addTask = (task) => {
      setTasks((prev) => [...prev, task]);
    };
  
    const updateTask = (updatedTask) => {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === updatedTask._id
            ? updatedTask
            : task
        )
      );
    };
  
    const deleteTask = (id) => {
      setTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );
    };
  
    return (
      <TaskContext.Provider
        value={{
          tasks,
          setTasks,
          addTask,
          updateTask,
          deleteTask,
        }}
      >
        {children}
      </TaskContext.Provider>
    );
  };
  
  export const useTasks = () => useContext(TaskContext);
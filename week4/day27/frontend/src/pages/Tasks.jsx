import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/task.service";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadTasks = async () => {
    try {
      const res = await getTasks(config);
      setTasks(res.data.data || res.data.tasks || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await createTask(
        {
          title,
        },
        config
      );

      setTitle("");
      loadTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id, config);
      loadTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async () => {
    try {
      await updateTask(
        editingId,
        {
          title: editTitle,
        },
        config
      );

      setEditingId(null);
      setEditTitle("");
      loadTasks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary mb-0">
              <i className="bi bi-list-task me-2"></i>
              Task Management
            </h2>
          </div>

          <div className="input-group mb-4">
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a new task..."
            />

            <button
              className="btn btn-primary"
              onClick={addTask}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="alert alert-info text-center">
              No Tasks Found
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="card shadow-sm mb-3"
              >
                <div className="card-body">

                  {editingId === task._id ? (
                    <>
                      <input
                        className="form-control mb-3"
                        value={editTitle}
                        onChange={(e) =>
                          setEditTitle(e.target.value)
                        }
                      />

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success"
                          onClick={saveEdit}
                        >
                          <i className="bi bi-check-circle me-2"></i>
                          Save
                        </button>

                        <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditingId(null);
                            setEditTitle("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-0">
                          <i className="bi bi-check2-square text-primary me-2"></i>
                          {task.title}
                        </h5>

                        <div className="d-flex gap-2">

                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => startEdit(task)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              removeTask(task._id)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                        </div>

                      </div>
                    </>
                  )}

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
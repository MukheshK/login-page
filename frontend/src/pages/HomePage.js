import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import {
  fetchTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../services/api";

export default function HomePage({ token, user, onLogout, onSessionExpired }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    if (!token) return;
    setError("");
    try {
      const { ok, status, data } = await fetchTasksApi(token);
      if (status === 401) {
        onSessionExpired();
        return;
      }
      if (!ok) {
        setError(data.message || "Failed to fetch tasks");
        return;
      }
      setTasks(data.tasks || []);
    } catch {
      setError("Cannot connect to backend server");
    }
  }, [token, onSessionExpired]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSaveTask = async (taskPayload, taskId) => {
    setError("");
    try {
      const { ok, status, data } = taskId
        ? await updateTaskApi(token, taskId, taskPayload)
        : await createTaskApi(token, taskPayload);

      if (status === 401) {
        onSessionExpired();
        return false;
      }
      if (!ok) {
        setError(data.message || "Failed to save task");
        return false;
      }

      setEditingTask(null);
      await loadTasks();
      return true;
    } catch {
      setError("Cannot connect to backend server");
      return false;
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError("");
    try {
      const { ok, status, data } = await deleteTaskApi(token, taskId);
      if (status === 401) {
        onSessionExpired();
        return;
      }
      if (!ok) {
        setError(data.message || "Failed to delete task");
        return;
      }
      if (editingTask?.id === taskId) {
        setEditingTask(null);
      }
      await loadTasks();
    } catch {
      setError("Cannot connect to backend server");
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: "40px auto", fontFamily: "sans-serif" }}>
      <Navbar username={user?.username} onLogout={onLogout} />
      <hr style={{ margin: "20px 0" }} />

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <TaskForm
        editingTask={editingTask}
        onSaveTask={handleSaveTask}
        onCancelEdit={() => setEditingTask(null)}
      />

      <h3 style={{ marginTop: 28 }}>Tasks</h3>
      <TaskList
        tasks={tasks}
        onEditTask={(task) => setEditingTask(task)}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}
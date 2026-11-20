import React from "react";

export default function TaskList({ tasks, onEditTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {tasks.map((task) => (
        <li
          key={task.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>{task.title}</strong> — <span>{task.status}</span>
            {task.description && <p style={{ margin: "6px 0 0" }}>{task.description}</p>}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={() => onEditTask(task)}>
              Update
            </button>
            <button type="button" onClick={() => onDeleteTask(task.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
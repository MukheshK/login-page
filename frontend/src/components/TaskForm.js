import React, { useState, useEffect } from "react";

const EMPTY_FORM = { title: "", description: "", status: "Pending" };

export default function TaskForm({ editingTask, onSaveTask, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "Pending",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    const saved = await onSaveTask(form, editingTask?.id);
    setSubmitting(false);
    if (saved && !editingTask) {
      setForm(EMPTY_FORM);
    }
  };

  return (
    <section>
      <h3>{editingTask ? "Update Task" : "Add New Task"}</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="text"
          placeholder="Task Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Task Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : editingTask ? "Update Task" : "Add Task"}
          </button>
          {editingTask && (
            <button type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
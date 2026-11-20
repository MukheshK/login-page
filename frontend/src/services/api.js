const API_BASE_URL = "http://localhost:5000/api";

const buildHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// Module 1: Auth
export const registerUser = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
};

export const loginUser = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
};

// Module 2: Tasks
export const fetchTasksApi = async (token) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: buildHeaders(token),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
};

export const createTaskApi = async (token, payload) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
};

export const updateTaskApi = async (token, taskId, payload) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
};

export const deleteTaskApi = async (token, taskId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
};
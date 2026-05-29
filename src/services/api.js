const API_BASE_URL = "http://localhost:8000/api/v1";

function getAuthHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

async function handleApiError(response, defaultMessage) {
  let errorMessage = defaultMessage;

  try {
    const errorData = await response.json();
    if (errorData.detail) {
      errorMessage = errorData.detail;
    }
  } catch {}

  throw new Error(errorMessage);
}

export async function register(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    await handleApiError(response, "Registration failed");
  }

  return response.json();
}

export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    await handleApiError(response, "Login failed");
  }

  return response.json();
}

export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
}

export async function getTasks(token) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: getAuthHeader(token),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to fetch tasks");
  }

  return response.json();
}

export async function createTask(token, title, description) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to create task");
  }

  return response.json();
}

export async function updateTask(token, taskId, title, description) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to update task");
  }

  return response.json();
}

export async function deleteTask(token, taskId) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: getAuthHeader(token),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to delete task");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getSessions(token) {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    headers: getAuthHeader(token),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to fetch sessions");
  }

  return response.json();
}

export async function getActiveSession(token) {
  const response = await fetch(`${API_BASE_URL}/sessions/active`, {
    headers: getAuthHeader(token),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to fetch active session");
  }

  return response.json();
}

export async function startSession(token, taskId) {
  const response = await fetch(`${API_BASE_URL}/sessions/start/${taskId}`, {
    method: "POST",
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to start session");
  }

  return response.json();
}

export async function endSession(token, taskId, notes) {
  const response = await fetch(`${API_BASE_URL}/sessions/end/${taskId}`, {
    method: "POST",
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to end session");
  }

  return response.json();
}

export async function deleteSession(token, sessionId) {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: "DELETE",
    headers: getAuthHeader(token),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to delete session");
  }
}

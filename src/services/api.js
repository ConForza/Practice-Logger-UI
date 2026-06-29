const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

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
    headers: getAuthHeader(token),
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

export async function getTeacherStudents(token) {
  const response = await fetch(`${API_BASE_URL}/teacher/students`, {
    headers: getAuthHeader(token),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to fetch students");
  }

  return response.json();
}

export async function getTeacherStudentSessions(token, studentId) {
  const response = await fetch(
    `${API_BASE_URL}/teacher/students/${studentId}/sessions`,
    {
      headers: getAuthHeader(token),
    },
  );

  if (!response.ok) {
    await handleApiError(response, "Failed to fetch student sessions");
  }

  return response.json();
}

export async function assignTaskToStudent(token, studentId, taskData) {
  const response = await fetch(
    `${API_BASE_URL}/teacher/students/${studentId}/tasks`,
    {
      method: "POST",
      headers: {
        ...getAuthHeader(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    },
  );

  if (!response.ok) {
    await handleApiError(response, "Failed to create task");
  }

  return response.json();
}

export async function getAdminUsers(token) {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: getAuthHeader(token),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to fetch users");
  }

  return response.json();
}

export async function updateUserRole(token, userId, role) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to update user role");
  }

  return response.json();
}

export async function updateUserStatus(token, userId, isActive) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ is_active: isActive }),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to update user status");
  }

  return response.json();
}

export async function getWeeklyStudentProgress(token) {
  const response = await fetch(`${API_BASE_URL}/teacher/progress/weekly`, {
    headers: getAuthHeader(token),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to fetch weekly progress");
  }

  return response.json();
}

export async function resetUserPassword(token, userId, newPassword) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
    method: "PATCH",
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to reset password");
  }

  return response.json();
}

export async function changeCurrentUserPassword(
  token,
  currentPassword,
  newPassword,
) {
  const response = await fetch(`${API_BASE_URL}/users/me/password`, {
    method: "PATCH",
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to change password");
  }

  return response.json();
}

export async function getTeacherStudentLinks(token) {
  const response = await fetch(`${API_BASE_URL}/admin/teacher-student-links`, {
    headers: getAuthHeader(token),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to fetch teacher assignments");
  }

  return response.json();
}

export async function createTeacherStudentLink(token, teacherId, studentId) {
  const response = await fetch(`${API_BASE_URL}/admin/teacher-student-links`, {
    method: "POST",
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      teacher_id: teacherId,
      student_id: studentId,
      instrument: "General",
    }),
  });

  if (!response.ok) {
    await handleApiError(response, "Failed to create teacher assignment");
  }

  return response.json();
}

export async function deleteTeacherStudentLink(token, linkId) {
  const response = await fetch(
    `${API_BASE_URL}/admin/teacher-student-links/${linkId}`,
    {
      method: "DELETE",
      headers: getAuthHeader(token),
    },
  );

  if (!response.ok) {
    await handleApiError(response, "Failed to delete teacher assignment");
  }

  return response.json();
}

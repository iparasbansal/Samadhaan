const API_URL =
  (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, ""); // default goes through Vite proxy to 5001

const buildUrl = (endpoint) =>
  `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

async function request(endpoint, options = {}) {
  const res = await fetch(buildUrl(endpoint), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text || "Non-JSON response from server" };
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
}

export const registerUser = (userData) => {
  console.log("Attempting to register user:", userData);
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData) => {
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const getGrievances = () => request("/grievances");

export const createGrievance = (grievanceData, token) => {
  return request("/grievances", {
    method: "POST",
    headers: { "x-auth-token": token },
    body: JSON.stringify(grievanceData),
  });
};

export const deleteGrievance = (id, token) => {
  return request(`/grievances/${id}`, {
    method: "DELETE",
    headers: { "x-auth-token": token },
  });
};

export const updateGrievance = (id, grievanceData, token) => {
  return request(`/grievances/${id}`, {
    method: "PUT",
    headers: { "x-auth-token": token },
    body: JSON.stringify(grievanceData),
  });
};

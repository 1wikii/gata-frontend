const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// Helper function untuk handle 401 error dengan proper logging
const handle401Error = (endpoint: string, method: string) => {
  console.error(
    `[${method}] ${endpoint} - Status 401: Unauthorized. Token akan dihapus.`
  );
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    // Gunakan setTimeout agar state ter-update sebelum redirect
    setTimeout(() => {
      window.location.href = process.env.NEXT_PUBLIC_BASE_URL + "/auth/login";
    }, 100);
  }
};

export const api = {
  get: async (endpoint: string, signal?: AbortSignal) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔧 FIX: Tambahkan credentials untuk mengirim cookie
      signal,
    });

    if (response.status === 401) {
      handle401Error(endpoint, "GET");
      throw new Error("Unauthorized");
    }

    return response;
  },
  post: async (endpoint: string, data: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
      credentials: "include",
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = process.env.NEXT_PUBLIC_BASE_URL + "/auth/login";
      throw new Error("Unauthorized");
    }

    return response;
  },
  put: async (endpoint: string, data: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (response.status === 401) {
      handle401Error(endpoint, "PUT");
      throw new Error("Unauthorized");
    }

    return response;
  },

  delete: async (endpoint: string, data?: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    if (response.status === 401) {
      handle401Error(endpoint, "DELETE");
      throw new Error("Unauthorized");
    }
    return response;
  },

  postWithAuth: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    return response;
  },

  postWithFile: async (endpoint: string, formData: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type, biarkan browser yang set otomatis sebagai multipart/form-data
      },
      body: formData,
      credentials: "include",
    });

    if (response.status === 401) {
      handle401Error(endpoint, "POST (File)");
      throw new Error("Unauthorized");
    }

    return response;
  },
};

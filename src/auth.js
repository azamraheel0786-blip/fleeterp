const BASE = "http://91.99.94.34:8080/api";

export const login = async (username, password) => {
  try {
    const res  = await fetch(`${BASE}/Auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ username, password })
    });
    const data = await res.json();
    if(data.success) {
      sessionStorage.setItem("user", JSON.stringify({
        username: data.username,
        fullName: data.fullName,
      }));
    }
    return data;
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

export const logout = () => {
  sessionStorage.removeItem("user");
};

export const isLoggedIn = () => {
  return sessionStorage.getItem("user") !== null;
};

export const getUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user")) || null;
  } catch { return null; }
};

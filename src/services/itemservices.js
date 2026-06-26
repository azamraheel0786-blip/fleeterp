const BASE = "http://91.99.94.34:8080/api";

export const getItems = async () => {
  try {
    const res  = await fetch(`${BASE}/Items`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
};

export const saveItem = async (newItem) => {
  if(!newItem.code || !newItem.name)
    return { success: false, message: "Fill all fields!" };
  try {
    const res = await fetch(`${BASE}/Items`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ code: newItem.code, name: newItem.name })
    });
    if(res.ok) return { success: true, message: "Saved successfully" };
    const err = await res.json();
    return { success: false, message: err.message || "Failed to save." };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

export const deleteItem = async (code) => {
  try {
    const res = await fetch(`${BASE}/Items/${code}`, {
      method: "DELETE"
    });
    if(res.ok) return { success: true, message: "Deleted successfully" };
    return { success: false, message: "Item not found" };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

export const updateItem = async (code, updated) => {
  try {
    const res = await fetch(`${BASE}/Items/${code}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(updated)
    });
    if(res.ok) return { success: true, message: "Updated successfully" };
    return { success: false, message: "Item not found" };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};
const BASE = "http://91.99.94.34:8080/api";
// ── GET ALL ────────────────────────────────────
export const getStatuses = async () => {
  try {
    const res = await fetch(`${BASE}/statuses`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
};

// ── SAVE ───────────────────────────────────────
export const saveStatus = async (newStatus) => {
  if (!newStatus.code || !newStatus.name)
    return { success: false, message: "Fill out all fields" };

  try {
    const res = await fetch(`${BASE}/statuses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: newStatus.code, name: newStatus.name }),
    });
    if (res.ok) return { success: true, message: "Saved successfully" };
    const err = await res.json();
    return { success: false, message: err.message || "Failed to save status." };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

// ── DELETE ─────────────────────────────────────
export const deleteStatus = async (code) => {
  try {
    const res = await fetch(`${BASE}/statuses/${code}`, { method: "DELETE" });
    if (res.ok) return { success: true, message: "Deleted successfully" };
    return { success: false, message: "Status not found" };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

// ── UPDATE ─────────────────────────────────────
export const updateStatus = async (code, updated) => {
  try {
    const res = await fetch(`${BASE}/statuses/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) return { success: true, message: "Updated successfully" };
    return { success: false, message: "Status not found" };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

const BASE = "http://91.99.94.34:8080/api";

// ── GET ALL ──────────────────────────────────
export const getParties = async () => {
  try {
    const res = await fetch(`${BASE}/parties`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
};

// ── SAVE ────────────────────────────────────
export const saveParty = async (newparty) => {
  if (!newparty.code || !newparty.name)
    return { success: false, message: "Fill out all fields" };

  try {
    const res = await fetch(`${BASE}/parties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: newparty.code,
        name: newparty.name,
      })
    });
    if (res.ok) return { success: true,  message: "Saved successfully" };
    const err = await res.json();
    return { success: false, message: err.message || "Failed to save party." };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

// ── DELETE ───────────────────────────────────
export const deleteParty = async (code) => {
  try {
    const res = await fetch(`${BASE}/parties/${code}`, {
      method: "DELETE"
    });
    if (res.ok) return { success: true,  message: "Deleted successfully" };
    return            { success: false, message: "Party not found" };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

// ── UPDATE ───────────────────────────────────
export const updateParty = async (code, updated) => {
  try {
    const res = await fetch(`${BASE}/parties/${code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    if (res.ok) return { success: true,  message: "Updated successfully" };
    return            { success: false, message: "Party not found" };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};
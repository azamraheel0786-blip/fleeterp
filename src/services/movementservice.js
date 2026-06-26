const BASE = "http://91.99.94.34:8080/api";

export const getTodayDateTime = () => {
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  return (
    now.getFullYear() + "-" +
    pad(now.getMonth() + 1) + "-" +
    pad(now.getDate()) + "T" +
    pad(now.getHours()) + ":" +
    pad(now.getMinutes())
  );
};

// ── GET ALL ──────────────────────────────────
export const getMovements = async () => {
  try {
    const res  = await fetch(`${BASE}/Movements`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
};

// ── SAVE ─────────────────────────────────────
export const saveMovement = async (form) => {
  if(!form.doNo)   return { success: false, message: "DO number is required." };
  if(!form.status) return { success: false, message: "Status is required." };

  try {
    const res = await fetch(`${BASE}/Movements`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        doNo:           form.doNo.trim(),
        entryDateTime:  form.entryDateTime  || getTodayDateTime(),
        driverName:     form.driverName     || "",
        driverMobile:   form.driverMobile   || "",
        status:         form.status,
        remarks:        form.remarks        || "",
        statusDateTime: form.statusDateTime || "",
      })
    });
    if(res.ok) return { success: true, message: "Movement saved successfully." };
    const err = await res.json();
    return { success: false, message: err.message || "Failed to save." };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

// ── DELETE by id ─────────────────────────────
export const deleteMovement = async (id) => {
  try {
    const res = await fetch(`${BASE}/Movements/${id}`, {
      method: "DELETE"
    });
    if(res.ok) return { success: true, message: "Movement record deleted." };
    return { success: false, message: "Record not found." };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

// ── GET LATEST STATUS PER DO ─────────────────
// Returns object: { "DO-1021": "Delivered", "DO-1022": "In Transit" }
export const getLatestStatusPerDO = async () => {
  try {
    const res  = await fetch(`${BASE}/Movements/lateststatus`);
    const data = await res.json();
    return data || {};
  } catch { return {}; }
};

// ── SEARCH by DO number ──────────────────────
export const searchMovements = async (doNo) => {
  try {
    const all = await getMovements();
    return all.filter(m =>
      (m.doNo || "").toLowerCase().includes((doNo || "").toLowerCase())
    );
  } catch { return []; }
};

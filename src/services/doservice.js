const BASE = "http://91.99.94.34:8080/api";

// ── GET ALL ──────────────────────────────────
export const getDOs = async () => {
  try {
    const res  = await fetch(`${BASE}/DeliveryOrders`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
};

// ── GET NEXT DO NUMBER ───────────────────────
export const getNextDONo = async () => {
  try {
    const res  = await fetch(`${BASE}/DeliveryOrders/nextno`);
    const data = await res.json();
    return data.doNo || "DO-1001";
  } catch { return "DO-1001"; }
};

// ── TODAY DATE ───────────────────────────────
export const getTodayDate = () =>
  new Date().toISOString().split("T")[0];

// ── SAVE ─────────────────────────────────────
export const saveDO = async (form) => {
  if(!form.sourceParty || !form.destParty ||
     !form.item        || !form.vehicleNo)
    return { success: false, message: "Fill all required fields!" };

  try {
    const res = await fetch(`${BASE}/DeliveryOrders`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        doNo:         form.doNo,
        date:         form.date,
        sourceParty:  form.sourceParty,
        destParty:    form.destParty,
        item:         form.item,
        weight:       form.weight      || "",
        bags:         form.bags        || "",
        vehicleNo:    form.vehicleNo,
        freight:      form.freight     || "",
        driverName:   form.drivername  || "",
        driverNumber: form.drivernumber|| "",
      })
    });
    if(res.ok) return { success: true, message: "DO saved successfully!" };
    const err = await res.json();
    return { success: false, message: err.message || "Failed to save!" };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

// ── DELETE ───────────────────────────────────
export const deleteDO = async (doNo) => {
  try {
    const res = await fetch(`${BASE}/DeliveryOrders/${doNo}`, {
      method: "DELETE"
    });
    if(res.ok) return { success: true, message: "DO deleted!" };
    return { success: false, message: "DO not found!" };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};

// ── SEARCH ───────────────────────────────────
export const searchDO = async (doNo) => {
  try {
    const res  = await fetch(`${BASE}/DeliveryOrders/${doNo}`);
    if(!res.ok) return null;
    return await res.json();
  } catch { return null; }
};

// ── UPDATE (EDIT) ────────────────────────────
export const updateDO = async (doNo, form) => {
  try {
    const res = await fetch(`${BASE}/DeliveryOrders/${doNo}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doNo:         form.doNo,
        date:         form.date,
        sourceParty:  form.sourceParty,
        destParty:    form.destParty,
        item:         form.item,
        weight:       form.weight,
        bags:         form.bags,
        vehicleNo:    form.vehicleNo,
        freight:      form.freight,
        driverName:   form.drivername,
        driverNumber: form.drivernumber,
      }),
    });
    if (res.ok) return { success: true, message: "Updated successfully!" };
    const err = await res.json().catch(() => ({}));
    return { success: false, message: err.message || "Failed to update." };
  } catch {
    return { success: false, message: "Cannot connect to server." };
  }
};
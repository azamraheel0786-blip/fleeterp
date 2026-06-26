import { useState, useEffect } from "react";
import {
  getDOs, saveDO, deleteDO, updateDO, getNextDONo, getTodayDate,
} from "../services/doservice";
import { getParties } from "../services/partyservice";
import { getItems }   from "../services/itemservices";

/* ─── STYLES ────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .do-root {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #F1F5F9;
    background-image: radial-gradient(ellipse 60% 35% at 90% 0%, rgba(99,102,241,0.07) 0%, transparent 60%);
    padding: 32px 28px;
  }

  .do-page-header { margin-bottom: 24px; }
  .do-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
  .do-bar {
    width: 4px; height: 26px;
    background: linear-gradient(180deg, #2563EB, #6366F1);
    border-radius: 2px; flex-shrink: 0;
  }
  .do-page-title { font-size: 22px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em; }
  .do-page-sub   { font-size: 13px; color: #94A3B8; margin-left: 16px; margin-top: 3px; }

  .do-toast {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 14px; border-radius: 10px;
    font-size: 12.5px; font-weight: 500;
    animation: do-slide 0.3s ease;
    white-space: nowrap;
  }
  @keyframes do-slide {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .do-toast-icon {
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 10px; font-weight: 700;
  }
  .do-toast-success { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
  .do-toast-success .do-toast-icon { background: #BBF7D0; color: #15803D; }
  .do-toast-error   { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
  .do-toast-error   .do-toast-icon { background: #FECACA; color: #DC2626; }

  .do-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #E8EDF5;
    box-shadow: 0 2px 12px rgba(15,23,42,0.05);
    margin-bottom: 20px;
    overflow: hidden;
    animation: do-rise 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes do-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .do-card-head {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    padding: 15px 22px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .do-card-head-left { display: flex; align-items: center; gap: 10px; }
  .do-card-head-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(37,99,235,0.30);
    border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
  }
  .do-card-head-title { font-size: 13px; font-weight: 600; color: #fff; }
  .do-card-dots { display: flex; gap: 5px; }
  .do-card-dot  { width: 9px; height: 9px; border-radius: 50%; }
  .do-card-body { padding: 24px; }

  .do-field { display: flex; flex-direction: column; gap: 5px; }
  .do-label {
    font-size: 10.5px; font-weight: 700; color: #94A3B8;
    text-transform: uppercase; letter-spacing: 0.09em;
  }
  .do-input, .do-select {
    padding: 10px 13px;
    border: 1.5px solid #E2E8F0; border-radius: 10px;
    font-size: 13px; font-family: 'Inter', sans-serif;
    color: #0F172A; background: #F8FAFC;
    outline: none; width: 100%;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
    appearance: none;
  }
  .do-input::placeholder { color: #CBD5E1; }
  .do-input:focus, .do-select:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    background: #fff;
  }
  .do-select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }

  .do-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
  .do-row-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; margin-bottom: 14px; }
  .do-divider { border: none; border-top: 1px solid #F1F5F9; margin: 20px 0; }

  .do-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
  .do-btn {
    padding: 9px 20px; border-radius: 10px; border: none;
    font-size: 13px; font-family: 'Inter', sans-serif; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: all 0.18s;
  }
  .do-btn:active { transform: scale(0.97); }
  .do-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .do-btn-save   { background: #2563EB; color: #fff; box-shadow: 0 3px 10px rgba(37,99,235,0.3); }
  .do-btn-save:hover:not(:disabled) { background: #1D4ED8; transform: translateY(-1px); }
  .do-btn-delete { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
  .do-btn-delete:hover:not(:disabled) { background: #FEE2E2; }
  .do-btn-close  { background: #F8FAFC; color: #64748B; border: 1px solid #E2E8F0; }
  .do-btn-close:hover { background: #F1F5F9; }

  .do-table-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #E8EDF5;
    box-shadow: 0 2px 12px rgba(15,23,42,0.05);
    overflow: hidden;
    animation: do-rise 0.45s 0.08s cubic-bezier(0.22,1,0.36,1) both;
  }

  .do-toolbar {
    padding: 13px 18px;
    border-bottom: 1px solid #F1F5F9;
    display: flex; align-items: center;
    justify-content: space-between;
    gap: 12px; flex-wrap: wrap;
  }
  .do-toolbar-left  { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .do-table-title   { font-size: 14px; font-weight: 700; color: #0F172A; }
  .do-count-pill {
    font-size: 11px; font-weight: 600; color: #2563EB;
    background: #EFF6FF; padding: 2px 9px; border-radius: 99px;
  }

  .do-search-wrap { position: relative; flex-shrink: 0; }
  .do-search-icon {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: #94A3B8; pointer-events: none; display: flex; align-items: center;
  }
  .do-search-input {
    padding: 8px 32px 8px 34px;
    border: 1.5px solid #E2E8F0; border-radius: 10px;
    font-size: 13px; font-family: 'Inter', sans-serif;
    color: #0F172A; background: #F8FAFC;
    outline: none; width: 220px;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s, width 0.25s;
  }
  .do-search-input::placeholder { color: #CBD5E1; }
  .do-search-input:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    background: #fff; width: 260px;
  }
  .do-search-clear {
    position: absolute; right: 9px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #94A3B8; display: flex; padding: 2px; transition: color 0.15s;
  }
  .do-search-clear:hover { color: #475569; }

  table.do-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.do-table th {
    padding: 10px 16px; text-align: left;
    font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.07em;
    color: #94A3B8; background: #F8FAFC;
    border-bottom: 1px solid #E8EDF5; white-space: nowrap;
  }
  table.do-table td { padding: 13px 16px; border-bottom: 1px solid #F8FAFC; }
  table.do-table tr:last-child td { border-bottom: none; }
  table.do-table tbody tr { cursor: pointer; transition: background 0.12s; }
  table.do-table tbody tr:hover { background: #EFF6FF; }
  table.do-table tbody tr.selected { background: #EFF6FF; outline: 2px solid #2563EB; outline-offset: -2px; }

  .do-cell-dono  { color: #2563EB; font-weight: 700; font-size: 12.5px; }
  .do-cell-date  { color: #64748B; }
  .do-cell-party { color: #374151; }
  .do-cell-veh   { color: #64748B; font-weight: 500; }

  .do-empty { text-align: center; padding: 48px 20px; color: #CBD5E1; font-size: 13px; }
  .do-empty-icon { font-size: 28px; margin-bottom: 10px; opacity: 0.5; }

  .do-editing-banner {
    display: flex; align-items: center; gap: 8px;
    background: #FFFBEB; border: 1px solid #FDE68A;
    border-radius: 10px; padding: 8px 14px;
    font-size: 12.5px; font-weight: 600; color: #92400E;
    margin-bottom: 16px;
  }

  @media (max-width: 768px) {
    .do-root { padding: 20px 16px; }
    .do-row-2, .do-row-3 { grid-template-columns: 1fr; }
    .do-table-wrap { overflow-x: auto; }
  }
`;

/* ─── HELPERS ────────────────────────────────────────────────────────── */
const emptyForm = () => ({
  doNo:          "",
  date:          getTodayDate(),
  sourceParty:  "",
  destParty:    "",
  item:         "",
  weight:       "",
  bags:         "",
  vehicleNo:    "",
  freight:      "",
  drivername:   "",
  drivernumber: "",
});

const Ico = ({ d, w = 13 }) => (
  <svg width={w} height={w} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const Field = ({ label, children }) => (
  <div className="do-field">
    <label className="do-label">{label}</label>
    {children}
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function DOEntry() {

  const [form,        setForm]        = useState(emptyForm());
  const [orders,      setOrders]      = useState([]);
  const [parties,     setParties]     = useState([]);
  const [items,       setItems]       = useState([]);
  const [message,     setMessage]     = useState({ text: "", type: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [isEditing,   setIsEditing]   = useState(false);

  // ── CSS injection ──
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // ── Load all data on mount ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [dos, pts, its, nextNo] = await Promise.all([
          getDOs(), getParties(), getItems(), getNextDONo(),
        ]);
        setOrders(dos);
        setParties(pts);
        setItems(its);
        setForm(f => ({ ...f, doNo: nextNo }));
      } catch {
        setMessage({ text: "Failed to load data!", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // ── SAVE (new DO) ──
  const handleSave = async () => {
    setLoading(true);
    setMessage({ text: "Saving...", type: "success" });
    const r = await saveDO(form);
    setMessage({ text: r.message, type: r.success ? "success" : "error" });
    if (r.success) {
      const [dos, nextNo] = await Promise.all([getDOs(), getNextDONo()]);
      setOrders(dos);
      setForm({ ...emptyForm(), doNo: nextNo });
    }
    setLoading(false);
  };

  // ── EDIT (update existing DO) ──
  const handleEdit = async () => {
    if (!form.doNo) {
      setMessage({ text: "No DO selected.", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "Updating...", type: "success" });
    
    const r = await updateDO(form.doNo, form);
    setMessage({ text: r.message, type: r.success ? "success" : "error" });
    
    if (r.success) {
      setIsEditing(false);
      const [dos, nextNo] = await Promise.all([getDOs(), getNextDONo()]);
      setOrders(dos);
      setForm({ ...emptyForm(), doNo: nextNo });
    }
    setLoading(false);
  };

  // ── DELETE ──
  const handleDelete = async () => {
    if (!form.doNo) {
      setMessage({ text: "No delivery order selected.", type: "error" });
      return;
    }
    setLoading(true);
    const r = await deleteDO(form.doNo);
    setMessage({ text: r.message, type: r.success ? "success" : "error" });
    if (r.success) {
      setIsEditing(false);
      const [dos, nextNo] = await Promise.all([getDOs(), getNextDONo()]);
      setOrders(dos);
      setForm({ ...emptyForm(), doNo: nextNo });
    }
    setLoading(false);
  };

  // ── CLOSE ──
  const handleClose = async () => {
    setIsEditing(false);
    const nextNo = await getNextDONo();
    setForm({ ...emptyForm(), doNo: nextNo });
    setMessage({ text: "", type: "" });
    setSearchQuery("");
  };

  // ── ROW CLICK — enters edit mode ──
  const handleRowClick = (order) => {
    setForm({
      doNo:          order.doNo         || "",
      date:          order.date         || "",
      sourceParty:  order.sourceParty  || "",
      destParty:    order.destParty    || "",
      item:         order.item         || "",
      weight:       order.weight       || "",
      bags:         order.bags         || "",
      vehicleNo:    order.vehicleNo    || "",
      freight:      order.freight      || "",
      drivername:   order.driverName   || "",
      drivernumber: order.driverNumber || "",
    });
    setIsEditing(true);
    setMessage({ text: "", type: "" });
  };

  // ── LIVE SEARCH ──
  const q = searchQuery.trim().toLowerCase();
  const filteredOrders = q
    ? orders.filter(o =>
        [o.doNo, o.date, o.sourceParty, o.destParty, o.vehicleNo, o.driverName]
          .some(v => (v || "").toLowerCase().includes(q))
      )
    : orders;

  return (
    <div className="do-root">

      <div className="do-page-header">
        <div className="do-title-row">
          <div className="do-bar" />
          <h1 className="do-page-title">Delivery Order Entry</h1>
        </div>
        <div className="do-page-sub">Create, search and manage delivery orders</div>
      </div>

      {/* FORM CARD */}
      <div className="do-card">
        <div className="do-card-head">
          <div className="do-card-head-left">
            <div className="do-card-head-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
              </svg>
            </div>
            <span className="do-card-head-title">
              {isEditing ? `Editing: ${form.doNo}` : "Delivery Order Entry"}
            </span>
          </div>
          <div className="do-card-dots">
            <div className="do-card-dot" style={{ background: isEditing ? "#F59E0B" : "#22C55E" }}/>
            <div className="do-card-dot" style={{ background: "#F59E0B" }}/>
            <div className="do-card-dot" style={{ background: "rgba(255,255,255,0.2)" }}/>
          </div>
        </div>

        <div className="do-card-body">

          {/* EDITING BANNER */}
          {isEditing && (
            <div className="do-editing-banner">
              ✏️ Editing {form.doNo} — make changes and click Update to save
            </div>
          )}

          {/* ROW 1 */}
          <div className="do-row-2">
            <Field label="DO No">
              <input className="do-input" type="text" name="doNo"
                value={form.doNo} onChange={handleChange}
                placeholder="DO-1001" disabled={loading || isEditing} />
            </Field>
            <Field label="Date">
              <input className="do-input" type="date" name="date"
                value={form.date} onChange={handleChange} disabled={loading} />
            </Field>
          </div>

          {/* ROW 2 */}
          <div className="do-row-2">
            <Field label="Source Party">
              <select className="do-select" name="sourceParty"
                value={form.sourceParty} onChange={handleChange} disabled={loading}>
                <option value="">— Select Party —</option>
                {parties.slice().reverse().map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Destination Party">
              <select className="do-select" name="destParty"
                value={form.destParty} onChange={handleChange} disabled={loading}>
                <option value="">— Select Party —</option>
                {parties.slice().reverse().map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* ROW 3 */}
          <div className="do-row-3">
            <Field label="Item">
              <select className="do-select" name="item"
                value={form.item} onChange={handleChange} disabled={loading}>
                <option value="">— Select Item —</option>
                {items.slice().reverse().map(i => (
                  <option key={i.id} value={i.name}>{i.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Weight (KG)">
              <input className="do-input" type="number" name="weight"
                value={form.weight} onChange={handleChange}
                placeholder="10000" disabled={loading} />
            </Field>
            <Field label="Bags">
              <input className="do-input" type="number" name="bags"
                value={form.bags} onChange={handleChange}
                placeholder="200" disabled={loading} />
            </Field>
          </div>

          {/* ROW 4 */}
          <div className="do-row-2">
            <Field label="Vehicle No">
              <input className="do-input" type="text" name="vehicleNo"
                value={form.vehicleNo} onChange={handleChange}
                placeholder="MNA-1234" disabled={loading} />
            </Field>
            <Field label="Freight (PKR)">
              <input className="do-input" type="number" name="freight"
                value={form.freight} onChange={handleChange}
                placeholder="25000" disabled={loading} />
            </Field>
          </div>

          {/* ROW 5 */}
          <div className="do-row-2">
            <Field label="Driver Name">
              <input className="do-input" type="text" name="drivername"
                value={form.drivername} onChange={handleChange}
                placeholder="Driver Name" disabled={loading} />
            </Field>
            <Field label="Driver Mobile">
              <input className="do-input" type="text" name="drivernumber"
                value={form.drivernumber} onChange={handleChange}
                placeholder="0300-0000000" disabled={loading} />
            </Field>
          </div>

          <hr className="do-divider" />

          {/* BUTTONS */}
          <div className="do-buttons">
            {isEditing ? (
              <button className="do-btn do-btn-save"
                onClick={handleEdit} disabled={loading}
                style={{ background: "#F59E0B", boxShadow: "0 3px 10px rgba(245,158,11,0.3)" }}>
                <Ico d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                {loading ? "Updating..." : "✏️ Update"}
              </button>
            ) : (
              <button className="do-btn do-btn-save"
                onClick={handleSave} disabled={loading}>
                <Ico d="M5 13l4 4L19 7"/>
                {loading ? "Wait..." : "Save"}
              </button>
            )}
            <button className="do-btn do-btn-delete"
              onClick={handleDelete} disabled={loading}>
              <Ico d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
              Delete
            </button>
            <button className="do-btn do-btn-close"
              onClick={handleClose} disabled={loading}>
              <Ico d="M6 18L18 6M6 6l12 12"/>
              Close
            </button>
          </div>

        </div>
      </div>

      {/* TABLE CARD */}
      <div className="do-table-card">
        <div className="do-toolbar">
          <div className="do-toolbar-left">
            <span className="do-table-title">Delivery Orders</span>
            <span className="do-count-pill">
              {filteredOrders.length}{q ? ` of ${orders.length}` : " records"}
            </span>
            {message.text && (
              <div className={`do-toast do-toast-${message.type}`}>
                <div className="do-toast-icon">
                  {message.type === "success" ? "✓" : "!"}
                </div>
                {message.text}
              </div>
            )}
          </div>

          <div className="do-search-wrap">
            <span className="do-search-icon">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input className="do-search-input" type="text"
              placeholder="Search orders…" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}/>
            {searchQuery && (
              <button className="do-search-clear" onClick={() => setSearchQuery("")}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="do-table-wrap">
          <table className="do-table">
            <thead>
              <tr>
                {["DO No","Date","Source","Destination","Vehicle","Driver","Driver Mobile"].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="do-empty">
                    <div className="do-empty-icon">
                      {loading ? "⏳" : q ? "🔍" : "📦"}
                    </div>
                    {loading ? "Loading orders..." : q ? `No orders match "${searchQuery}"` : "No delivery orders yet."}
                  </td>
                </tr>
              ) : filteredOrders.slice().reverse().map(order => (
                <tr key={order.id}
                  className={form.doNo === order.doNo && isEditing ? "selected" : ""}
                  onClick={() => handleRowClick(order)}>
                  <td className="do-cell-dono">{order.doNo}</td>
                  <td className="do-cell-date">{order.date}</td>
                  <td className="do-cell-party">{order.sourceParty}</td>
                  <td className="do-cell-party">{order.destParty}</td>
                  <td className="do-cell-veh">{order.vehicleNo}</td>
                  <td className="do-cell-party">{order.driverName || "—"}</td>
                  <td className="do-cell-party">{order.driverNumber || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
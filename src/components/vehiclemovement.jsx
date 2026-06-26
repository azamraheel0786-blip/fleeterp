import { useState, useEffect } from "react";
import {
  getMovements, saveMovement, deleteMovement, getTodayDateTime,
} from "../services/movementservice";
import { getDOs } from "../services/doservice";
import { getStatuses } from "../services/statusservice";

/* ─── STYLES ─────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .vm-root {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #F1F5F9;
    background-image: radial-gradient(ellipse 60% 35% at 90% 0%, rgba(99,102,241,0.07) 0%, transparent 60%);
    padding: 32px 28px;
  }

  .vm-page-header { margin-bottom: 24px; }
  .vm-title-row   { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
  .vm-bar {
    width: 4px; height: 26px;
    background: linear-gradient(180deg, #2563EB, #6366F1);
    border-radius: 2px; flex-shrink: 0;
  }
  .vm-page-title { font-size: 22px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em; }
  .vm-page-sub   { font-size: 13px; color: #94A3B8; margin-left: 16px; margin-top: 3px; }

  .vm-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #E8EDF5;
    box-shadow: 0 2px 12px rgba(15,23,42,0.05);
    margin-bottom: 20px;
    overflow: hidden;
    animation: vm-rise 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes vm-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .vm-card-head {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    padding: 15px 22px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .vm-card-head-left { display: flex; align-items: center; gap: 10px; }
  .vm-card-head-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(37,99,235,0.30);
    border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
  }
  .vm-card-head-title { font-size: 13px; font-weight: 600; color: #fff; }
  .vm-card-dots { display: flex; gap: 5px; }
  .vm-card-dot  { width: 9px; height: 9px; border-radius: 50%; }
  .vm-card-body { padding: 24px; }

  .vm-field { display: flex; flex-direction: column; gap: 5px; }
  .vm-label {
    font-size: 10.5px; font-weight: 700; color: #94A3B8;
    text-transform: uppercase; letter-spacing: 0.09em;
  }
  .vm-input, .vm-select, .vm-textarea {
    padding: 10px 13px;
    border: 1.5px solid #E2E8F0; border-radius: 10px;
    font-size: 13px; font-family: 'Inter', sans-serif;
    color: #0F172A; background: #F8FAFC;
    outline: none; width: 100%;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
    appearance: none;
  }
  .vm-input::placeholder { color: #CBD5E1; }
  .vm-input:focus, .vm-select:focus, .vm-textarea:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    background: #fff;
  }
  .vm-input:disabled { background: #F1F5F9; color: #94A3B8; cursor: not-allowed; }
  .vm-select {
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }

  @keyframes vm-fill-flash {
    0%   { background: #EFF6FF; border-color: #93C5FD; }
    100% { background: #F8FAFC; border-color: #E2E8F0; }
  }
  .vm-auto-filled { animation: vm-fill-flash 0.6s ease forwards; }

  .vm-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
  .vm-divider { border: none; border-top: 1px solid #F1F5F9; margin: 20px 0; }

  .vm-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
  .vm-btn {
    padding: 9px 20px; border-radius: 10px; border: none;
    font-size: 13px; font-family: 'Inter', sans-serif; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: all 0.18s;
  }
  .vm-btn:active  { transform: scale(0.97); }
  .vm-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .vm-btn-save   { background: #22C55E; color: #fff; box-shadow: 0 3px 10px rgba(34,197,94,0.3); }
  .vm-btn-save:hover:not(:disabled)   { background: #16A34A; transform: translateY(-1px); }
  .vm-btn-delete { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
  .vm-btn-delete:hover:not(:disabled) { background: #FEE2E2; }
  .vm-btn-close  { background: #F8FAFC; color: #64748B; border: 1px solid #E2E8F0; }
  .vm-btn-close:hover  { background: #F1F5F9; }

  .vm-table-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #E8EDF5;
    box-shadow: 0 2px 12px rgba(15,23,42,0.05);
    overflow: hidden;
    animation: vm-rise 0.45s 0.08s cubic-bezier(0.22,1,0.36,1) both;
  }

  .vm-toolbar {
    padding: 13px 18px;
    border-bottom: 1px solid #F1F5F9;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; flex-wrap: wrap;
  }
  .vm-toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .vm-table-title  { font-size: 14px; font-weight: 700; color: #0F172A; }
  .vm-count-pill {
    font-size: 11px; font-weight: 600; color: #2563EB;
    background: #EFF6FF; padding: 2px 9px; border-radius: 99px;
  }

  .vm-toast {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 13px; border-radius: 10px;
    font-size: 12.5px; font-weight: 500;
    animation: vm-slide 0.3s ease; white-space: nowrap;
  }
  @keyframes vm-slide {
    from { opacity: 0; transform: translateY(-5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .vm-toast-icon {
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 10px; font-weight: 700;
  }
  .vm-toast-success { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
  .vm-toast-success .vm-toast-icon { background: #BBF7D0; color: #15803D; }
  .vm-toast-error   { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
  .vm-toast-error   .vm-toast-icon { background: #FECACA; color: #DC2626; }

  .vm-search-wrap { position: relative; flex-shrink: 0; }
  .vm-search-icon {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: #94A3B8; pointer-events: none; display: flex; align-items: center;
  }
  .vm-search-input {
    padding: 8px 32px 8px 34px;
    border: 1.5px solid #E2E8F0; border-radius: 10px;
    font-size: 13px; font-family: 'Inter', sans-serif;
    color: #0F172A; background: #F8FAFC;
    outline: none; width: 220px;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s, width 0.25s;
  }
  .vm-search-input::placeholder { color: #CBD5E1; }
  .vm-search-input:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    background: #fff; width: 260px;
  }
  .vm-search-clear {
    position: absolute; right: 9px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #94A3B8; display: flex; padding: 2px; transition: color 0.15s;
  }
  .vm-search-clear:hover { color: #475569; }

  table.vm-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.vm-table th {
    padding: 10px 16px; text-align: left;
    font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.07em;
    color: #94A3B8; background: #F8FAFC;
    border-bottom: 1px solid #E8EDF5; white-space: nowrap;
  }
  table.vm-table td { padding: 12px 16px; border-bottom: 1px solid #F8FAFC; }
  table.vm-table tr:last-child td { border-bottom: none; }
  table.vm-table tbody tr { cursor: pointer; transition: background 0.12s; }
  table.vm-table tbody tr:hover { background: #EFF6FF; }

  .vm-cell-do     { color: #2563EB; font-weight: 700; font-size: 12.5px; }
  .vm-cell-driver { color: #374151; }
  .vm-cell-time   { color: #64748B; font-size: 12px; }
  .vm-cell-remark { color: #64748B; font-size: 12px; max-width: 180px;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .vm-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 99px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.03em;
  }
  .vm-badge-dot { width: 6px; height: 6px; border-radius: 50%; }
  .vm-badge-pending   { background: #EFF6FF; color: #2563EB; }
  .vm-badge-pending   .vm-badge-dot { background: #2563EB; }
  .vm-badge-transit   { background: #FFFBEB; color: #B45309; }
  .vm-badge-transit   .vm-badge-dot { background: #F59E0B; }
  .vm-badge-delivered { background: #F0FDF4; color: #15803D; }
  .vm-badge-delivered .vm-badge-dot { background: #22C55E; }
  .vm-badge-default   { background: #F1F5F9; color: #64748B; }
  .vm-badge-default   .vm-badge-dot { background: #94A3B8; }

  .vm-empty { text-align: center; padding: 48px 20px; color: #CBD5E1; font-size: 13px; }
  .vm-empty-icon { font-size: 28px; margin-bottom: 10px; opacity: 0.5; }

  @media (max-width: 768px) {
    .vm-root { padding: 20px 16px; }
    .vm-row-2 { grid-template-columns: 1fr; }
    .vm-table-wrap { overflow-x: auto; }
  }
`;

/* ─── HELPERS (no hooks here — plain functions/components only) ───────── */
const emptyForm = () => ({
  id:             null,
  doNo:           "",
  entryDateTime:  getTodayDateTime(),
  driverName:     "",
  driverMobile:   "",
  status:         "",
  remarks:        "",
  statusDateTime: "",
});

const Badge = ({ status }) => {
  const map = { "Pending": "pending", "In Transit": "transit", "Delivered": "delivered" };
  const cls = map[status] || "default";
  return (
    <span className={`vm-badge vm-badge-${cls}`}>
      <span className="vm-badge-dot" />
      {status || "—"}
    </span>
  );
};

const Ico = ({ d, w = 13 }) => (
  <svg width={w} height={w} fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const Field = ({ label, children }) => (
  <div className="vm-field">
    <label className="vm-label">{label}</label>
    {children}
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function VehicleMovementEntry() {

  // ── ALL useState calls must be here, inside the function ──
  const [form,          setForm]          = useState(emptyForm());
  const [movements,     setMovements]     = useState([]);
  const [dos,           setDos]           = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);   // ← FIXED: now inside component
  const [message,       setMessage]       = useState({ text: "", type: "" });
  const [searchQuery,   setSearchQuery]   = useState("");
  const [autoFilled,    setAutoFilled]    = useState(false);
  const [loading,       setLoading]       = useState(false);

  // ── CSS injection ──
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // ── Load data on mount ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [mvs, doList, statuses] = await Promise.all([
          getMovements(),
          getDOs(),
          getStatuses(),
        ]);
        setMovements(mvs);
        setDos(doList);
        setStatusOptions(statuses.map(s => s.name));
      } catch {
        setMessage({ text: "Failed to load data!", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Auto-fill driver from DO ──
  const handleDOChange = (value) => {
    const matched = dos.find(
      d => (d.doNo || "").toLowerCase() === value.toLowerCase()
    );
    if (matched) {
      setForm(f => ({
        ...f,
        doNo:         matched.doNo,
        driverName:   matched.driverName   || matched.drivername   || "",
        driverMobile: matched.driverNumber || matched.drivernumber || "",
      }));
      setAutoFilled(true);
      setTimeout(() => setAutoFilled(false), 700);
    } else {
      setForm(f => ({ ...f, doNo: value }));
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "doNo") { handleDOChange(value); return; }
    setForm(f => ({ ...f, [name]: value }));
  };

  // ── SAVE ──
  const handleSave = async () => {
    if (!form.doNo)   { setMessage({ text: "Please select a DO number.", type: "error" }); return; }
    if (!form.status) { setMessage({ text: "Please select a status.",    type: "error" }); return; }
    setLoading(true);
    setMessage({ text: "Saving...", type: "success" });
    const r = await saveMovement(form);
    setMessage({ text: r.message, type: r.success ? "success" : "error" });
    if (r.success) {
      setMovements(await getMovements());
      setForm(emptyForm());
    }
    setLoading(false);
  };

  // ── DELETE ──
  const handleDelete = async () => {
    if (!form.id) { setMessage({ text: "Click a row first to select it.", type: "error" }); return; }
    setLoading(true);
    const r = await deleteMovement(form.id);
    setMessage({ text: r.message, type: r.success ? "success" : "error" });
    if (r.success) {
      setMovements(await getMovements());
      setForm(emptyForm());
    }
    setLoading(false);
  };

  // ── CLOSE ──
  const handleClose = () => {
    setForm(emptyForm());
    setMessage({ text: "", type: "" });
    setSearchQuery("");
  };

  // ── ROW CLICK ──
  const handleRowClick = row => {
    setForm({
      id:             row.id             || null,
      doNo:           row.doNo           || "",
      entryDateTime:  row.entryDateTime  || "",
      driverName:     row.driverName     || "",
      driverMobile:   row.driverMobile   || "",
      status:         row.status         || "",
      remarks:        row.remarks        || "",
      statusDateTime: row.statusDateTime || "",
    });
    setMessage({ text: "", type: "" });
  };

  // ── SEARCH ──
  const q = searchQuery.trim().toLowerCase();
  const filtered = q
    ? movements.filter(m =>
        [m.doNo, m.driverName, m.driverMobile,
         m.status, m.remarks, m.entryDateTime]
          .some(v => (v || "").toLowerCase().includes(q))
      )
    : movements;

  /* ─── JSX ─────────────────────────────────────────────────────────── */
  return (
    <div className="vm-root">

      <div className="vm-page-header">
        <div className="vm-title-row">
          <div className="vm-bar" />
          <h1 className="vm-page-title">Vehicle Movement Entry</h1>
        </div>
        <div className="vm-page-sub">Track status updates against each delivery order</div>
      </div>

      {/* FORM CARD */}
      <div className="vm-card">
        <div className="vm-card-head">
          <div className="vm-card-head-left">
            <div className="vm-card-head-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 17l-4-4m0 0l4-4m-4 4h16M3 12V7a2 2 0 012-2h9l4 4v3"/>
              </svg>
            </div>
            <span className="vm-card-head-title">Vehicle Movement Entry</span>
          </div>
          <div className="vm-card-dots">
            <div className="vm-card-dot" style={{ background: "#22C55E" }}/>
            <div className="vm-card-dot" style={{ background: "#F59E0B" }}/>
            <div className="vm-card-dot" style={{ background: "rgba(255,255,255,0.2)" }}/>
          </div>
        </div>

        <div className="vm-card-body">

          {/* ROW 1 — DO + Entry DateTime */}
          <div className="vm-row-2">
            <Field label="Select DO">
              <input
                className="vm-input" type="text" name="doNo"
                list="do-list" value={form.doNo} onChange={handleChange}
                placeholder="Type or select DO…" autoComplete="off" disabled={loading}
              />
             <datalist id="do-list">
  {dos.slice().reverse().map(d => (
    <option key={d.id} value={d.doNo}>
      {d.doNo} — {d.sourceParty} → {d.destParty}
    </option>
  ))}
</datalist>
            </Field>
            <Field label="Entry Date / Time">
              <input
                className="vm-input" type="datetime-local" name="entryDateTime"
                value={form.entryDateTime} onChange={handleChange} disabled={loading}
              />
            </Field>
          </div>

          {/* ROW 2 — Driver (auto-filled) */}
          <div className="vm-row-2">
            <Field label="Driver Name">
              <input
                className={`vm-input${autoFilled ? " vm-auto-filled" : ""}`}
                type="text" name="driverName" value={form.driverName}
                onChange={handleChange} placeholder="Auto-filled from DO" disabled={loading}
              />
            </Field>
            <Field label="Driver Mobile">
              <input
                className={`vm-input${autoFilled ? " vm-auto-filled" : ""}`}
                type="text" name="driverMobile" value={form.driverMobile}
                onChange={handleChange} placeholder="Auto-filled from DO" disabled={loading}
              />
            </Field>
          </div>

          {/* ROW 3 — Status (dynamic from API) + Remarks */}
          <div className="vm-row-2">
<Field label="Status">
  <input
    className="vm-input"
    type="text"
    name="status"
    list="status-list"
    value={form.status}
    onChange={handleChange}
    placeholder="Select or type a status…"
    autoComplete="off"
    disabled={loading}
  />
 <datalist id="status-list">
  {statusOptions.slice().reverse().map(s => (
    <option key={s} value={s} />
  ))}
</datalist>
</Field>
            <Field label="Remarks">
              <input
                className="vm-input" type="text" name="remarks"
                value={form.remarks} onChange={handleChange}
                placeholder="e.g. Left gate after loading" disabled={loading}
              />
            </Field>
          </div>

          {/* ROW 4 — Status DateTime */}
          <div className="vm-row-2">
            <Field label="Status Date / Time">
              <input
                className="vm-input" type="datetime-local" name="statusDateTime"
                value={form.statusDateTime} onChange={handleChange} disabled={loading}
              />
            </Field>
            <div />
          </div>

          <hr className="vm-divider" />

          <div className="vm-buttons">
            <button className="vm-btn vm-btn-save" onClick={handleSave} disabled={loading}>
              <Ico d="M5 13l4 4L19 7"/> {loading ? "Wait..." : "Save"}
            </button>
            <button className="vm-btn vm-btn-delete" onClick={handleDelete} disabled={loading}>
              <Ico d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/> Delete
            </button>
            <button className="vm-btn vm-btn-close" onClick={handleClose} disabled={loading}>
              <Ico d="M6 18L18 6M6 6l12 12"/> Close
            </button>
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="vm-table-card">
        <div className="vm-toolbar">
          <div className="vm-toolbar-left">
            <span className="vm-table-title">Movement History</span>
            <span className="vm-count-pill">
              {filtered.length}{q ? ` of ${movements.length}` : " records"}
            </span>
            {message.text && (
              <div className={`vm-toast vm-toast-${message.type}`}>
                <div className="vm-toast-icon">{message.type === "success" ? "✓" : "!"}</div>
                {message.text}
              </div>
            )}
          </div>
          <div className="vm-search-wrap">
            <span className="vm-search-icon">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              className="vm-search-input" type="text"
              placeholder="Search movements…" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="vm-search-clear" onClick={() => setSearchQuery("")}>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="vm-table-wrap">
          <table className="vm-table">
            <thead>
              <tr>
                {["DO","Driver","Mobile","Status","Entry Date/Time","Status Date/Time","Remarks"].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="vm-empty">
                    <div className="vm-empty-icon">{loading ? "⏳" : q ? "🔍" : "🚚"}</div>
                    {loading ? "Loading movements..." : q ? `No movements match "${searchQuery}"` : "No movement records yet."}
                  </td>
                </tr>
              ) :filtered.slice().reverse().map((m, i) => (
                <tr key={m.id || i} onClick={() => handleRowClick(m)}>
                  <td className="vm-cell-do">{m.doNo}</td>
                  <td className="vm-cell-driver">{m.driverName  || "—"}</td>
                  <td className="vm-cell-time">{m.driverMobile || "—"}</td>
                  <td><Badge status={m.status} /></td>
                  <td className="vm-cell-time">{m.entryDateTime  || "—"}</td>
                  <td className="vm-cell-time">{m.statusDateTime || "—"}</td>
                  <td className="vm-cell-remark">{m.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
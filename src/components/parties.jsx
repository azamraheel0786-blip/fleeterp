import { useState, useEffect } from "react";
import { getParties, saveParty, deleteParty } from "../services/partyservice";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .pg-root {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #F1F5F9;
    background-image: radial-gradient(ellipse 70% 40% at 10% 0%, rgba(37,99,235,0.07) 0%, transparent 60%);
    padding: 32px 28px;
  }
  .pg-page-header { margin-bottom: 28px; }
  .pg-page-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
  .pg-page-bar {
    width: 4px; height: 26px;
    background: linear-gradient(180deg, #22C55E, #16A34A);
    border-radius: 2px; flex-shrink: 0;
  }
  .pg-page-title { font-size: 22px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em; }
  .pg-page-sub { font-size: 13px; color: #94A3B8; margin-left: 16px; margin-top: 3px; }

  .pg-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #E8EDF5;
    box-shadow: 0 2px 12px rgba(15,23,42,0.05);
    overflow: hidden;
    max-width: 560px;
    animation: pg-rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes pg-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pg-card-header {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    padding: 16px 20px;
    display: flex; align-items: center; gap: 10px;
  }
  .pg-card-header-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(34,197,94,0.25);
    border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
  }
  .pg-card-title { font-size: 13px; font-weight: 600; color: #fff; }

  .pg-card-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

  .pg-toast {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 14px; border-radius: 10px;
    font-size: 12.5px; font-weight: 500;
    animation: pg-slide-in 0.3s ease;
  }
  @keyframes pg-slide-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pg-toast-success { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
  .pg-toast-error   { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
  .pg-toast-loading { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }

  .pg-fields { display: grid; grid-template-columns: 1fr 1.6fr; gap: 12px; }
  .pg-field  { display: flex; flex-direction: column; gap: 5px; }
  .pg-label  { font-size: 10.5px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.09em; }
  .pg-input  {
    padding: 9px 12px; border: 1.5px solid #E2E8F0; border-radius: 9px;
    font-size: 13px; font-family: 'Inter', sans-serif; color: #0F172A;
    background: #F8FAFC; outline: none; width: 100%;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .pg-input::placeholder { color: #CBD5E1; }
  .pg-input:focus { border-color: #22C55E; box-shadow: 0 0 0 3px rgba(34,197,94,0.12); background: #fff; }

  .pg-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
  .pg-btn {
    padding: 8px 16px; border-radius: 9px; border: none;
    font-size: 12.5px; font-family: 'Inter', sans-serif; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: all 0.18s;
  }
  .pg-btn:active   { transform: scale(0.97); }
  .pg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .pg-btn-save   { background: #22C55E; color: #fff; box-shadow: 0 2px 8px rgba(34,197,94,0.3); }
  .pg-btn-save:hover:not(:disabled)   { background: #16A34A; }
  .pg-btn-search { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
  .pg-btn-search:hover { background: #E2E8F0; }
  .pg-btn-delete { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
  .pg-btn-delete:hover:not(:disabled) { background: #FEE2E2; }
  .pg-btn-close  { background: #F8FAFC; color: #94A3B8; border: 1px solid #E2E8F0; }
  .pg-btn-close:hover { background: #F1F5F9; color: #64748B; }

  .pg-table-wrap  { border: 1px solid #F1F5F9; border-radius: 10px; overflow: hidden; }
  .pg-table-head  {
    padding: 10px 14px; background: #F8FAFC; border-bottom: 1px solid #F1F5F9;
    font-size: 11px; font-weight: 600; color: #94A3B8;
    display: flex; justify-content: space-between; align-items: center;
  }
  .pg-record-badge {
    background: #F0FDF4; color: #15803D;
    padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 700;
  }
  table.pg-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.pg-table th {
    padding: 8px 14px; text-align: left; font-size: 10.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.07em;
    color: #94A3B8; background: #F8FAFC; border-bottom: 1px solid #F1F5F9;
  }
  table.pg-table td { padding: 10px 14px; border-bottom: 1px solid #F8FAFC; }
  table.pg-table tr:last-child td { border-bottom: none; }
  table.pg-table tbody tr { cursor: pointer; transition: background 0.12s; }
  table.pg-table tbody tr:hover { background: #F0FDF4; }
  .pg-code-cell { font-size: 12px; font-weight: 600; color: #16A34A; font-variant-numeric: tabular-nums; }
  .pg-name-cell { color: #374151; }
  .pg-empty { text-align: center; padding: 28px; color: #CBD5E1; font-size: 13px; }

  @media (max-width: 768px) {
    .pg-root { padding: 20px 16px; }
    .pg-card { max-width: 100%; }
    .pg-fields { grid-template-columns: 1fr; }
  }
`;

const IconSave   = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>);
const IconSearch = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>);
const IconDelete = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>);
const IconClose  = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

export default function Parties() {
  const [form,    setForm]    = useState({ code: "", name: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(false);
  const [data,    setData]    = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setPageLoading(true);
    const rows = await getParties();
    setData(rows);
    setPageLoading(false);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    setMessage({ text: "Saving...", type: "loading" });
    try {
      const r = await saveParty(form);
      setMessage({ text: r.message, type: r.success ? "success" : "error" });
      if (r.success) { setForm({ code: "", name: "" }); await loadData(); }
    } catch { setMessage({ text: "Connection error!", type: "error" }); }
    finally  { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!form.code) { setMessage({ text: "Enter a code to delete.", type: "error" }); return; }
    setLoading(true);
    setMessage({ text: "Deleting...", type: "loading" });
    try {
      const r = await deleteParty(form.code);
      setMessage({ text: r.message, type: r.success ? "success" : "error" });
      if (r.success) { setForm({ code: "", name: "" }); await loadData(); }
    } catch { setMessage({ text: "Connection error!", type: "error" }); }
    finally  { setLoading(false); }
  };

  const handleSearch = () => setSearch(form.code || form.name);
  const handleClose  = () => { setForm({ code: "", name: "" }); setSearch(""); setMessage({ text: "", type: "" }); };
  const handleRowClick = item => setForm({ code: item.code, name: item.name });

  const filtered = data.filter(d =>
    (d.code || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pg-root">
      <div className="pg-page-header">
        <div className="pg-page-title-row">
          <div className="pg-page-bar" />
          <h1 className="pg-page-title">Parties</h1>
        </div>
        <div className="pg-page-sub">Define and manage trading parties</div>
      </div>

      {pageLoading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94A3B8" }}>Loading...</div>
      ) : (
        <div className="pg-card">
          <div className="pg-card-header">
            <div className="pg-card-header-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              </svg>
            </div>
            <span className="pg-card-title">Define Party</span>
          </div>

          <div className="pg-card-body">
            {message.text && (
              <div className={`pg-toast pg-toast-${message.type}`}>
                <span>{message.type === "success" ? "✓" : message.type === "loading" ? "⏳" : "⚠"}</span>
                {message.text}
              </div>
            )}

            <div className="pg-fields">
              <div className="pg-field">
                <label className="pg-label">Code</label>
                <input className="pg-input" type="text" name="code" placeholder="P-0001"
                  value={form.code} onChange={handleChange} disabled={loading} />
              </div>
              <div className="pg-field">
                <label className="pg-label">Name</label>
                <input className="pg-input" type="text" name="name" placeholder="ABC Feed Mills"
                  value={form.name} onChange={handleChange} disabled={loading} />
              </div>
            </div>

            <div className="pg-buttons">
              <button className="pg-btn pg-btn-save"   onClick={handleSave}   disabled={loading}><IconSave />   {loading ? "Wait..." : "Save"}</button>
              <button className="pg-btn pg-btn-search" onClick={handleSearch} disabled={loading}><IconSearch /> Search</button>
              <button className="pg-btn pg-btn-delete" onClick={handleDelete} disabled={loading}><IconDelete /> Delete</button>
              <button className="pg-btn pg-btn-close"  onClick={handleClose}  disabled={loading}><IconClose />  Clear</button>
            </div>

            <div className="pg-table-wrap">
              <div className="pg-table-head">
                <span>Records</span>
                <span className="pg-record-badge">{filtered.length}</span>
              </div>
              <table className="pg-table">
                <thead><tr><th>Code</th><th>Name</th></tr></thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="2" className="pg-empty">{loading ? "Loading..." : "No records found"}</td></tr>
                  ) : filtered.slice().reverse().map(item => (
                    <tr key={item.id || item.code} onClick={() => handleRowClick(item)}>
                      <td className="pg-code-cell">{item.code}</td>
                      <td className="pg-name-cell">{item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
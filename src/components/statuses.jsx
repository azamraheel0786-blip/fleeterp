import { useState, useEffect } from "react";
import { getStatuses, saveStatus, deleteStatus } from "../services/statusservice";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .st-root {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #F1F5F9;
    background-image: radial-gradient(ellipse 70% 40% at 10% 0%, rgba(168,85,247,0.07) 0%, transparent 60%);
    padding: 32px 28px;
  }
  .st-page-header { margin-bottom: 28px; }
  .st-page-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
  .st-page-bar {
    width: 4px; height: 26px;
    background: linear-gradient(180deg, #A855F7, #7C3AED);
    border-radius: 2px; flex-shrink: 0;
  }
  .st-page-title { font-size: 22px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em; }
  .st-page-sub { font-size: 13px; color: #94A3B8; margin-left: 16px; margin-top: 3px; }

  .st-card {
    background: #fff; border-radius: 16px; border: 1px solid #E8EDF5;
    box-shadow: 0 2px 12px rgba(15,23,42,0.05); overflow: hidden;
    max-width: 560px;
    animation: st-rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes st-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .st-card-header {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    padding: 16px 20px; display: flex; align-items: center; gap: 10px;
  }
  .st-card-header-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(168,85,247,0.25); border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
  }
  .st-card-title { font-size: 13px; font-weight: 600; color: #fff; }
  .st-card-body  { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

  .st-toast { display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 10px; font-size: 12.5px; font-weight: 500; animation: st-slide-in 0.3s ease; }
  @keyframes st-slide-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .st-toast-success { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
  .st-toast-error   { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
  .st-toast-loading { background: #FAF5FF; color: #7C3AED; border: 1px solid #E9D5FF; }

  .st-fields { display: grid; grid-template-columns: 1fr 1.6fr; gap: 12px; }
  .st-field  { display: flex; flex-direction: column; gap: 5px; }
  .st-label  { font-size: 10.5px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.09em; }
  .st-input  {
    padding: 9px 12px; border: 1.5px solid #E2E8F0; border-radius: 9px;
    font-size: 13px; font-family: 'Inter', sans-serif; color: #0F172A;
    background: #F8FAFC; outline: none; width: 100%;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .st-input::placeholder { color: #CBD5E1; }
  .st-input:focus { border-color: #A855F7; box-shadow: 0 0 0 3px rgba(168,85,247,0.12); background: #fff; }

  .st-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
  .st-btn { padding: 8px 16px; border-radius: 9px; border: none; font-size: 12.5px; font-family: 'Inter', sans-serif; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.18s; }
  .st-btn:active   { transform: scale(0.97); }
  .st-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .st-btn-save   { background: #A855F7; color: #fff; box-shadow: 0 2px 8px rgba(168,85,247,0.3); }
  .st-btn-save:hover:not(:disabled)   { background: #9333EA; }
  .st-btn-search { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
  .st-btn-search:hover { background: #E2E8F0; }
  .st-btn-delete { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
  .st-btn-delete:hover:not(:disabled) { background: #FEE2E2; }
  .st-btn-close  { background: #F8FAFC; color: #94A3B8; border: 1px solid #E2E8F0; }
  .st-btn-close:hover { background: #F1F5F9; color: #64748B; }

  .st-table-wrap { border: 1px solid #F1F5F9; border-radius: 10px; overflow: hidden; }
  .st-table-head { padding: 10px 14px; background: #F8FAFC; border-bottom: 1px solid #F1F5F9; font-size: 11px; font-weight: 600; color: #94A3B8; display: flex; justify-content: space-between; align-items: center; }
  .st-record-badge { background: #FAF5FF; color: #7C3AED; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 700; }
  table.st-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.st-table th { padding: 8px 14px; text-align: left; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94A3B8; background: #F8FAFC; border-bottom: 1px solid #F1F5F9; }
  table.st-table td { padding: 10px 14px; border-bottom: 1px solid #F8FAFC; }
  table.st-table tr:last-child td { border-bottom: none; }
  table.st-table tbody tr { cursor: pointer; transition: background 0.12s; }
  table.st-table tbody tr:hover { background: #FAF5FF; }
  .st-code-cell { font-size: 12px; font-weight: 600; color: #9333EA; font-variant-numeric: tabular-nums; }
  .st-name-cell { color: #374151; }
  .st-empty { text-align: center; padding: 28px; color: #CBD5E1; font-size: 13px; }

  @media (max-width: 768px) {
    .st-root { padding: 20px 16px; }
    .st-card { max-width: 100%; }
    .st-fields { grid-template-columns: 1fr; }
  }
`;

const IconSave   = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>);
const IconSearch = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>);
const IconDelete = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>);
const IconClose  = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

export default function Statuses() {
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
    const rows = await getStatuses();
    setData(rows);
    setPageLoading(false);
  };
useEffect(() => {
  const seedStatuses = async () => {
    const rows = await getStatuses();
    const codes = rows.map(r => r.code.toLowerCase());
    
    // Add default statuses if they don't exist
    if (!codes.includes("in-transit")) {
      await saveStatus({ code: "in-transit", name: "In Transit" });
    }
    if (!codes.includes("delivered")) {
      await saveStatus({ code: "delivered", name: "Delivered" });
    }
    if (!codes.includes("pending")) {
      await saveStatus({ code: "pending", name: "Pending" });
    }
    await loadData();
  };
  seedStatuses();
}, []);
  const handleChange   = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSearch   = () => setSearch(form.code || form.name);
  const handleClose    = () => { setForm({ code: "", name: "" }); setSearch(""); setMessage({ text: "", type: "" }); };
  const handleRowClick = item => setForm({ code: item.code, name: item.name });

  const handleSave = async () => {
    setLoading(true); setMessage({ text: "Saving...", type: "loading" });
    try {
      const r = await saveStatus(form);
      setMessage({ text: r.message, type: r.success ? "success" : "error" });
      if (r.success) { setForm({ code: "", name: "" }); await loadData(); }
    } catch { setMessage({ text: "Connection error!", type: "error" }); }
    finally  { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!form.code) { setMessage({ text: "Enter a code to delete.", type: "error" }); return; }
    setLoading(true); setMessage({ text: "Deleting...", type: "loading" });
    try {
      const r = await deleteStatus(form.code);
      setMessage({ text: r.message, type: r.success ? "success" : "error" });
      if (r.success) { setForm({ code: "", name: "" }); await loadData(); }
    } catch { setMessage({ text: "Connection error!", type: "error" }); }
    finally  { setLoading(false); }
  };

  const filtered = data.filter(d =>
    (d.code || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="st-root">
      <div className="st-page-header">
        <div className="st-page-title-row">
          <div className="st-page-bar" />
          <h1 className="st-page-title">Statuses</h1>
        </div>
        <div className="st-page-sub">Define custom statuses used across delivery orders</div>
      </div>

      {pageLoading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94A3B8" }}>Loading...</div>
      ) : (
        <div className="st-card">
          <div className="st-card-header">
            <div className="st-card-header-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="st-card-title">Define Status</span>
          </div>

          <div className="st-card-body">
            {message.text && (
              <div className={`st-toast st-toast-${message.type}`}>
                <span>{message.type === "success" ? "✓" : message.type === "loading" ? "⏳" : "⚠"}</span>
                {message.text}
              </div>
            )}

            <div className="st-fields">
              <div className="st-field">
                <label className="st-label">Code</label>
                <input className="st-input" type="text" name="code" placeholder="S-0001"
                  value={form.code} onChange={handleChange} disabled={loading} />
              </div>
              <div className="st-field">
                <label className="st-label">Name</label>
                <input className="st-input" type="text" name="name" placeholder="In Transit"
                  value={form.name} onChange={handleChange} disabled={loading} />
              </div>
            </div>

            <div className="st-buttons">
              <button className="st-btn st-btn-save"   onClick={handleSave}   disabled={loading}><IconSave />   {loading ? "Wait..." : "Save"}</button>
              <button className="st-btn st-btn-search" onClick={handleSearch} disabled={loading}><IconSearch /> Search</button>
              <button className="st-btn st-btn-delete" onClick={handleDelete} disabled={loading}><IconDelete /> Delete</button>
              <button className="st-btn st-btn-close"  onClick={handleClose}  disabled={loading}><IconClose />  Clear</button>
            </div>

            <div className="st-table-wrap">
              <div className="st-table-head">
                <span>Records</span>
                <span className="st-record-badge">{filtered.length}</span>
              </div>
              <table className="st-table">
                <thead><tr><th>Code</th><th>Name</th></tr></thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="2" className="st-empty">{loading ? "Loading..." : "No records found"}</td></tr>
                  ) : filtered.slice().reverse().map(item => (
                    <tr key={item.id || item.code} onClick={() => handleRowClick(item)}>
                      <td className="st-code-cell">{item.code}</td>
                      <td className="st-name-cell">{item.name}</td>
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
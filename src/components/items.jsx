import { useState, useEffect } from "react";
import { getItems, saveItem, deleteItem } from "../services/itemservices";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .it-root {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #F1F5F9;
    background-image: radial-gradient(ellipse 70% 40% at 10% 0%, rgba(245,158,11,0.07) 0%, transparent 60%);
    padding: 32px 28px;
  }
  .it-page-header { margin-bottom: 28px; }
  .it-page-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
  .it-page-bar {
    width: 4px; height: 26px;
    background: linear-gradient(180deg, #F59E0B, #D97706);
    border-radius: 2px; flex-shrink: 0;
  }
  .it-page-title { font-size: 22px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em; }
  .it-page-sub { font-size: 13px; color: #94A3B8; margin-left: 16px; margin-top: 3px; }

  .it-card {
    background: #fff; border-radius: 16px; border: 1px solid #E8EDF5;
    box-shadow: 0 2px 12px rgba(15,23,42,0.05); overflow: hidden;
    max-width: 600px;
    animation: it-rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes it-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .it-card-header {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    padding: 16px 20px; display: flex; align-items: center; gap: 10px;
  }
  .it-card-header-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(245,158,11,0.25); border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
  }
  .it-card-title { font-size: 13px; font-weight: 600; color: #fff; }
  .it-card-body  { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

  .it-toast { display: flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 10px; font-size: 12.5px; font-weight: 500; animation: it-slide-in 0.3s ease; }
  @keyframes it-slide-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .it-toast-success { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
  .it-toast-error   { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
  .it-toast-loading { background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A; }

  .it-fields { display: grid; grid-template-columns: 1fr 1.6fr; gap: 12px; }
  .it-field  { display: flex; flex-direction: column; gap: 5px; }
  .it-label  { font-size: 10.5px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.09em; }
  .it-input  {
    padding: 9px 12px; border: 1.5px solid #E2E8F0; border-radius: 9px;
    font-size: 13px; font-family: 'Inter', sans-serif; color: #0F172A;
    background: #F8FAFC; outline: none; width: 100%;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .it-input::placeholder { color: #CBD5E1; }
  .it-input:focus { border-color: #F59E0B; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); background: #fff; }

  .it-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
  .it-btn { padding: 8px 16px; border-radius: 9px; border: none; font-size: 12.5px; font-family: 'Inter', sans-serif; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.18s; }
  .it-btn:active   { transform: scale(0.97); }
  .it-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .it-btn-save   { background: #F59E0B; color: #fff; box-shadow: 0 2px 8px rgba(245,158,11,0.3); }
  .it-btn-save:hover:not(:disabled)   { background: #D97706; }
  .it-btn-search { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
  .it-btn-search:hover { background: #E2E8F0; }
  .it-btn-delete { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
  .it-btn-delete:hover:not(:disabled) { background: #FEE2E2; }
  .it-btn-close  { background: #F8FAFC; color: #94A3B8; border: 1px solid #E2E8F0; }
  .it-btn-close:hover { background: #F1F5F9; color: #64748B; }

  .it-table-wrap { border: 1px solid #F1F5F9; border-radius: 10px; overflow: hidden; }
  .it-table-head { padding: 10px 14px; background: #F8FAFC; border-bottom: 1px solid #F1F5F9; font-size: 11px; font-weight: 600; color: #94A3B8; display: flex; justify-content: space-between; align-items: center; }
  .it-record-badge { background: #FFFBEB; color: #D97706; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 700; }
  table.it-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.it-table th { padding: 8px 14px; text-align: left; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #94A3B8; background: #F8FAFC; border-bottom: 1px solid #F1F5F9; }
  table.it-table td { padding: 10px 14px; border-bottom: 1px solid #F8FAFC; }
  table.it-table tr:last-child td { border-bottom: none; }
  table.it-table tbody tr { cursor: pointer; transition: background 0.12s; }
  table.it-table tbody tr:hover { background: #FFFBEB; }
  .it-sr-cell   { font-size: 11px; color: #CBD5E1; font-weight: 600; text-align: center; }
  .it-code-cell { font-size: 12px; font-weight: 600; color: #D97706; font-variant-numeric: tabular-nums; }
  .it-name-cell { color: #374151; }
  .it-empty { text-align: center; padding: 28px; color: #CBD5E1; font-size: 13px; }

  @media (max-width: 768px) {
    .it-root { padding: 20px 16px; }
    .it-card { max-width: 100%; }
    .it-fields { grid-template-columns: 1fr; }
  }
`;

const IconSave   = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>);
const IconSearch = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>);
const IconDelete = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>);
const IconClose  = () => (<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);

export default function Items() {
  const [form,        setForm]        = useState({ code: "", name: "" });
  const [message,     setMessage]     = useState({ text: "", type: "" });
  const [search,      setSearch]      = useState("");
  const [loading,     setLoading]     = useState(false);
  const [data,        setData]        = useState([]);
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
    const rows = await getItems();
    setData(Array.isArray(rows) ? rows : []);
    setPageLoading(false);
  };

  const handleChange   = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSearch   = () => setSearch(form.code || form.name);
  const handleClose    = () => { setForm({ code: "", name: "" }); setSearch(""); setMessage({ text: "", type: "" }); };
  const handleRowClick = item => setForm({ code: item.code, name: item.name });

  const handleSave = async () => {
    if (!form.code || !form.name) {
      setMessage({ text: "Please fill Code and Name!", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "Saving...", type: "loading" });
    try {
      const r = await saveItem(form);
      setMessage({ text: r.message, type: r.success ? "success" : "error" });
      if (r.success) {
        setForm({ code: "", name: "" });
        await loadData();   // ← reload table
      }
    } catch {
      setMessage({ text: "Connection error!", type: "error" });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!form.code) { setMessage({ text: "Enter a code to delete.", type: "error" }); return; }
    setLoading(true);
    setMessage({ text: "Deleting...", type: "loading" });
    try {
      const r = await deleteItem(form.code);
      setMessage({ text: r.message, type: r.success ? "success" : "error" });
      if (r.success) { setForm({ code: "", name: "" }); await loadData(); }
    } catch {
      setMessage({ text: "Connection error!", type: "error" });
    }
    setLoading(false);
  };

  const filtered = data.filter(d =>
    (d.code || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="it-root">
      <div className="it-page-header">
        <div className="it-page-title-row">
          <div className="it-page-bar" />
          <h1 className="it-page-title">Items</h1>
        </div>
        <div className="it-page-sub">Define and manage inventory items</div>
      </div>

      {pageLoading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94A3B8" }}>Loading...</div>
      ) : (
        <div className="it-card">
          <div className="it-card-header">
            <div className="it-card-header-icon">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <span className="it-card-title">Define Item</span>
          </div>

          <div className="it-card-body">
            {message.text && (
              <div className={`it-toast it-toast-${message.type}`}>
                <span>{message.type === "success" ? "✓" : message.type === "loading" ? "⏳" : "⚠"}</span>
                {message.text}
              </div>
            )}

            <div className="it-fields">
              <div className="it-field">
                <label className="it-label">Code</label>
                <input className="it-input" type="text" name="code" placeholder="I-0001"
                  value={form.code} onChange={handleChange} disabled={loading} />
              </div>
              <div className="it-field">
                <label className="it-label">Name</label>
                <input className="it-input" type="text" name="name" placeholder="Poultry Feed 50KG"
                  value={form.name} onChange={handleChange} disabled={loading} />
              </div>
            </div>

            <div className="it-buttons">
              <button className="it-btn it-btn-save"   onClick={handleSave}   disabled={loading}><IconSave />   {loading ? "Wait..." : "Save"}</button>
              <button className="it-btn it-btn-search" onClick={handleSearch} disabled={loading}><IconSearch /> Search</button>
              <button className="it-btn it-btn-delete" onClick={handleDelete} disabled={loading}><IconDelete /> Delete</button>
              <button className="it-btn it-btn-close"  onClick={handleClose}  disabled={loading}><IconClose />  Clear</button>
            </div>

            <div className="it-table-wrap">
              <div className="it-table-head">
                <span>Records</span>
                <span className="it-record-badge">{filtered.length}</span>
              </div>
              <table className="it-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px", textAlign: "center" }}>#</th>
                    <th>Code</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="3" className="it-empty">{loading ? "Loading..." : "No records found"}</td></tr>
                   ) : filtered.slice().reverse().map((item, index) => (
                    <tr key={item.id ?? index} onClick={() => handleRowClick(item)}>
                      <td className="it-sr-cell">{index + 1}</td>
                      <td className="it-code-cell">{item.code}</td>
                      <td className="it-name-cell">{item.name}</td>
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
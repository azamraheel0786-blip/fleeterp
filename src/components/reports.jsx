import { useState, useEffect } from "react";
import { getDOs } from "../services/doservice";
import { getLatestStatusPerDO } from "../services/movementservice";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .rp-root {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #F1F5F9;
    padding: 32px 28px;
  }

  .rp-page-header { margin-bottom: 24px; }
  .rp-title-row   { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
  .rp-bar { width: 4px; height: 26px; background: linear-gradient(180deg, #7C3AED, #6366F1); border-radius: 2px; }
  .rp-page-title { font-size: 22px; font-weight: 700; color: #0F172A; letter-spacing: -0.02em; }
  .rp-page-sub   { font-size: 13px; color: #94A3B8; margin-left: 16px; margin-top: 3px; }

  .rp-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 14px; margin-bottom: 24px;
  }
  .rp-stat { background: #fff; border: 1px solid #E8EDF5; border-radius: 14px; padding: 16px 18px; box-shadow: 0 2px 8px rgba(15,23,42,0.04); }
  .rp-stat-value { font-size: 26px; font-weight: 700; color: #0F172A; font-variant-numeric: tabular-nums; line-height: 1.1; }
  .rp-stat-label { font-size: 11.5px; color: #94A3B8; margin-top: 4px; font-weight: 500; }
  .rp-stat-dot   { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }

  .rp-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
  .rp-tab {
    padding: 7px 16px; border-radius: 9px; border: 1px solid #E2E8F0;
    font-size: 12.5px; font-family: 'Inter', sans-serif; font-weight: 600;
    cursor: pointer; background: #fff; color: #64748B; transition: all 0.16s;
    display: flex; align-items: center; gap: 6px;
  }
  .rp-tab:hover  { background: #F8FAFC; border-color: #CBD5E1; color: #374151; }
  .rp-tab.active { background: linear-gradient(135deg, #0F172A, #1E293B); color: #fff; border-color: transparent; box-shadow: 0 3px 10px rgba(15,23,42,0.18); }

  .rp-filter-bar {
    background: #fff; border: 1px solid #E8EDF5; border-radius: 12px;
    padding: 14px 18px; margin-bottom: 16px;
    display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;
    box-shadow: 0 1px 4px rgba(15,23,42,0.04);
  }
  .rp-filter-field { display: flex; flex-direction: column; gap: 4px; }
  .rp-filter-label { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.09em; }
  .rp-filter-input {
    padding: 7px 11px; border: 1.5px solid #E2E8F0; border-radius: 8px;
    font-size: 12.5px; font-family: 'Inter', sans-serif; color: #0F172A;
    background: #F8FAFC; outline: none;
    transition: border-color 0.16s, box-shadow 0.16s;
  }
  .rp-filter-input:focus { border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.10); background: #fff; }
  .rp-filter-btn {
    padding: 7px 18px; border-radius: 8px; border: none;
    font-size: 12.5px; font-family: 'Inter', sans-serif; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.16s;
  }
  .rp-filter-btn:active { transform: scale(0.97); }
  .rp-btn-apply  { background: #7C3AED; color: #fff; box-shadow: 0 2px 8px rgba(124,58,237,0.28); }
  .rp-btn-apply:hover  { background: #6D28D9; }
  .rp-btn-reset  { background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; }
  .rp-btn-reset:hover  { background: #E2E8F0; }
  .rp-btn-export { background: #F0FDF4; color: #15803D; border: 1px solid #BBF7D0; }
  .rp-btn-export:hover { background: #DCFCE7; }
  .rp-btn-print  { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
  .rp-btn-print:hover  { background: #DBEAFE; }

  .rp-table-card {
    background: #fff; border: 1px solid #E8EDF5; border-radius: 16px;
    box-shadow: 0 2px 12px rgba(15,23,42,0.05); overflow: hidden;
    animation: rp-rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes rp-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .rp-table-head {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    padding: 14px 20px; display: flex; align-items: center; justify-content: space-between;
  }
  .rp-table-head-left { display: flex; align-items: center; gap: 10px; }
  .rp-table-head-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: rgba(124,58,237,0.35); border: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
  }
  .rp-table-head-title { font-size: 13px; font-weight: 600; color: #fff; }
  .rp-count-pill {
    font-size: 10.5px; font-weight: 700; color: #A78BFA;
    background: rgba(124,58,237,0.25); padding: 2px 9px;
    border-radius: 99px; border: 1px solid rgba(124,58,237,0.3);
  }

  table.rp-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.rp-table th {
    padding: 10px 16px; text-align: left;
    font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;
    color: #94A3B8; background: #F8FAFC; border-bottom: 1px solid #E8EDF5; white-space: nowrap;
  }
  table.rp-table td { padding: 12px 16px; border-bottom: 1px solid #F8FAFC; color: #374151; vertical-align: top; }
  table.rp-table tr:last-child td { border-bottom: none; }
  table.rp-table tbody tr { transition: background 0.1s; }
  table.rp-table tbody tr:hover { background: #F5F3FF; }

  .rp-cell-sr     { color: #CBD5E1; font-weight: 700; font-size: 12px; text-align: center; width: 40px; }
  .rp-cell-id     { color: #7C3AED; font-weight: 700; font-size: 12.5px; }
  .rp-cell-date   { color: #64748B; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .rp-cell-detail { color: #0F172A; font-weight: 600; font-size: 12.5px; line-height: 1.5; }
  .rp-cell-detail-sub { color: #64748B; font-weight: 400; font-size: 11.5px; }
  .rp-cell-num    { font-variant-numeric: tabular-nums; font-weight: 600; color: #0F172A; }
  .rp-cell-muted  { color: #94A3B8; }

  .rp-badge { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.03em; }
  .rp-badge-pending    { background: #EFF6FF; color: #2563EB; }
  .rp-badge-transit    { background: #FFFBEB; color: #B45309; }
  .rp-badge-delivered  { background: #F0FDF4; color: #15803D; }
  .rp-badge-nomovement { background: #F1F5F9; color: #94A3B8; }
  .rp-badge-default    { background: #FEF3C7; color: #92400E; }

  .rp-empty { text-align: center; padding: 52px 20px; color: #CBD5E1; font-size: 13px; }
  .rp-empty-icon { font-size: 30px; margin-bottom: 10px; opacity: 0.45; }
  .rp-total-row td { background: #F5F3FF !important; font-weight: 700; color: #0F172A; border-top: 2px solid #DDD6FE !important; }

  .rp-print-header { display: none; }

  @media (max-width: 768px) {
    .rp-root { padding: 20px 16px; }
    .rp-filter-bar { flex-direction: column; }
    .rp-table-wrap { overflow-x: auto; }
  }

  /* ── PRINT STYLES ── */
 /* ── CENTERING A4 PRINT LAYOUT ── */
  @media print {
    html, body {
      background: #fff !important;
      color: #000 !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      /* Remove flex from body to prevent layout shifting */
      display: block !important; 
    }
    
    /* Hide all system layout elements */
    .rp-no-print, nav, aside, header, .sidebar, .navbar, [class*="sidebar"], [class*="navbar"] {
      display: none !important;
    }

    /* Set up the root container as a centering wrapper */
    .rp-root {
      padding: 0 !important;
      margin: 0 !important;
      width: 100% !important;
      display: block !important;
      background: #fff !important;
    }

    /* This forces the content card to align perfectly dead-center */
    .rp-table-card, 
    .rp-table-wrap,
    .rp-print-header {
      padding: 0 !important;
      margin: 0 auto !important; /* Perfect Center Alignment */
      width: 100% !important;
      max-width: 170mm !important; /* Forces standard printable area boundaries */
      display: block !important;
      background: #fff !important;
      box-shadow: none !important;
      border: none !important;
    }

    .rp-print-header {
      text-align: center;
      margin-bottom: 0 !important;
    }

    .rp-print-title {
      font-size: 13px;
      font-weight: bold;
      text-transform: uppercase;
      border: 1px solid #000 !important;
      border-bottom: none !important;
      padding: 6px;
      background: #f2f2f2 !important;
      text-align: center !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .rp-print-date {
      font-size: 11px;
      font-weight: bold;
      border: 1px solid #000 !important;
      border-bottom: none !important;
      padding: 5px;
      text-align: center !important;
    }

    /* Force table alignment matching the header container exactly */
    table.rp-table {
      width: 100% !important;
      max-width: 100% !important;
      border-collapse: collapse !important;
      display: table !important;
      margin: 0 auto !important;
      font-size: 11px !important;
    }

    table.rp-table th {
      background: #f2f2f2 !important;
      border: 1px solid #000 !important;
      color: #000 !important;
      padding: 6px 8px !important;
      text-align: center !important;
      font-weight: bold !important;
      text-transform: uppercase;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    table.rp-table td {
      border: 1px solid #000 !important;
      padding: 6px 8px !important;
      color: #000 !important;
      vertical-align: middle !important;
    }

    .rp-cell-sr { text-align: center; font-weight: bold; width: 45px !important; }
    .rp-cell-date { text-align: center !important; white-space: nowrap; }
    .rp-cell-num { text-align: right !important; }
    
    .rp-total-row td {
      background: #e5e5e5 !important;
      font-weight: bold;
      border: 1px solid #000 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .rp-badge {
      border: none !important;
      background: transparent !important;
      color: #000 !important;
      padding: 0 !important;
      font-size: 11px !important;
      font-weight: normal !important;
      display: inline !important;
    }

    @page {
      size: A4 portrait;
       margin: 0;
    }
  }
`;

/* ─── HELPERS ─────────────────────────────────────────────────────────── */
const Badge = ({ status }) => {
  const s = (status || "").toLowerCase();
  const cls = s === "pending" ? "pending" : s === "in transit" ? "transit" : s === "delivered" ? "delivered" : s === "no movement" ? "nomovement" : "default";
  return <span className={`rp-badge rp-badge-${cls}`}>{status || "—"}</span>;
};

const fmt = (n) => n ? Number(n).toLocaleString() : "—";

const Ico = ({ d, w = 14, color = "currentColor" }) => (
  <svg width={w} height={w} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const today      = () => new Date().toISOString().split("T")[0];
const monthStart = () => { const d = new Date(); d.setDate(1); return d.toISOString().split("T")[0]; };
const fmtDate    = (d) => { if(!d) return "—"; try { return new Date(d).toLocaleDateString("en-PK", { day:"2-digit", month:"short", year:"2-digit" }); } catch { return d; } };

const TABS = [
  { id: "daily",      label: "Daily DO",       icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "pending",    label: "Pending / Transit", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "delivered",  label: "Delivered",         icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "nomovement", label: "No Movement Yet",   icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "freight",    label: "Freight Register",  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "partywise",  label: "Party-wise Ledger", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
];

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────── */
export default function Reports() {
  const [activeTab,   setActiveTab]   = useState("daily");
  const [allDOs,      setAllDOs]      = useState([]);
  const [statusMap,   setStatusMap]   = useState({});
  const [fromDate,    setFromDate]    = useState("2000-01-01");
  const [toDate,      setToDate]      = useState(today());
  const [filterParty, setFilterParty] = useState("");
  const [filtered,    setFiltered]    = useState([]);

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "reports-dynamic-css";
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => {
      const target = document.getElementById("reports-dynamic-css");
      if(target) target.remove();
    };
  }, []);

  const applyFilters = (dos, map, tab, from, to, party) => {
    let result = [...dos];
    if(from) result = result.filter(d => d.date >= from);
    if(to)   result = result.filter(d => d.date <= to);
    if(party) result = result.filter(d =>
      d.sourceParty?.toLowerCase().includes(party.toLowerCase()) ||
      d.destParty?.toLowerCase().includes(party.toLowerCase())
    );
    if(tab === "pending")    result = result.filter(d => { const s = (map[d.doNo] || "Pending").toLowerCase(); return s === "pending" || s === "in transit"; });
    if(tab === "delivered")  result = result.filter(d => (map[d.doNo] || "").toLowerCase() === "delivered");
    if(tab === "nomovement") result = result.filter(d => !map[d.doNo]);
    setFiltered(result);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [dos, map] = await Promise.all([getDOs(), getLatestStatusPerDO()]);
        setAllDOs(dos);
        setStatusMap(map);
        applyFilters(dos, map, activeTab, fromDate, toDate, filterParty);
      } catch { console.error("Failed to load reports"); }
    };
    load();
  }, []);

  const handleApply = () => applyFilters(allDOs, statusMap, activeTab, fromDate, toDate, filterParty);
  
  const handleReset = () => {
    const f = "2000-01-01", t = today();
    setFromDate(f); setToDate(t); setFilterParty("");
    applyFilters(allDOs, statusMap, activeTab, f, t, "");
  };
  
  const handleTab = (id) => { 
    setActiveTab(id); 
    applyFilters(allDOs, statusMap, id, fromDate, toDate, filterParty); 
  };

  const handlePrint = () => window.print();

  const handleExport = () => {
 const rows = filtered.map((d, i) => [
  i + 1, d.doNo || "—", fmtDate(d.date),
  `"${d.sourceParty || "—"} / ${d.destParty || "—"}"`,
  `"${d.item || "—"}"`, d.vehicleNo || "—",
  d.weight || "—",
  statusMap[d.doNo] || "Pending"
]);
const headers = ["SR", "DO No", "Date", "Detail", "Item", "Vehicle #", "Weight (KG)", "Status"];
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${activeTab}-report.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  /* Stats */
  const total      = allDOs.length;
  const pending    = allDOs.filter(d => { const s = (statusMap[d.doNo] || "").toLowerCase(); return !s || s === "pending"; }).length;
  const transit    = allDOs.filter(d => (statusMap[d.doNo] || "").toLowerCase() === "in transit").length;
  const delivered  = allDOs.filter(d => (statusMap[d.doNo] || "").toLowerCase() === "delivered").length;
  const noMovement = allDOs.filter(d => !statusMap[d.doNo]).length;
  const freight    = allDOs.reduce((s, d) => s + (Number(d.freight) || 0), 0);

  /* Party ledger */
  const partyLedger = (() => {
    const map = {};
    filtered.forEach(d => {
      [d.sourceParty, d.destParty].forEach(p => {
        if(!p) return;
        if(!map[p]) map[p] = { party: p, dos: 0, weight: 0, bags: 0, freight: 0 };
        map[p].dos++;
        map[p].weight  += Number(d.weight)  || 0;
        map[p].bags    += Number(d.bags)    || 0;
        map[p].freight += Number(d.freight) || 0;
      });
    });
    return Object.values(map).sort((a, b) => b.dos - a.dos);
  })();

  const tabLabel = TABS.find(t => t.id === activeTab)?.label;

  /* ── Main table (Daily/Pending/Delivered/NoMovement) ── */
  const MainTable = () => (
    <table className="rp-table">
      <thead>
        <tr>
          <th style={{ width: "50px", textAlign: "center" }}>SR NO</th>
          <th>DO NO</th>
          <th>DATE</th>
          <th>DETAIL</th>
          <th>ITEM</th>
          <th>VEHICLE #</th>
          <th>WEIGHT</th>
          <th>STATUS</th>
        </tr>
      </thead>
      <tbody>
        {filtered.length === 0 ? (
          <tr>
            <td colSpan="8" className="rp-empty">
              <div className="rp-empty-icon">📋</div>
              No records found for the selected filters.
            </td>
          </tr>
        ) : filtered.map((d, i) => (
          <tr key={d.id || d.doNo || i}>
            <td className="rp-cell-sr">{i + 1}</td>
            <td className="rp-cell-id">{d.doNo || "—"}</td>
            <td className="rp-cell-date">{fmtDate(d.date)}</td>
            <td>
              <div className="rp-cell-detail">
                {d.sourceParty || "—"} / {d.destParty || "—"}
              </div>
            </td>
            <td>{d.item || <span className="rp-cell-muted">—</span>}</td>
            <td className="rp-cell-muted">{d.vehicleNo || "—"}</td>
            <td className="rp-cell-num">{fmt(d.weight)}</td>
            <td>
              <Badge status={activeTab === "nomovement" ? "No Movement" : (statusMap[d.doNo] || "Pending")} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  /* ── Freight table ── */
  const FreightTable = () => (
    <table className="rp-table">
      <thead>
        <tr>
          <th style={{ width:"40px", textAlign:"center" }}>#</th>
          <th>DO NO</th>
          <th>Date</th>
          <th>Detail</th>
          <th>Item</th>
          <th>Vehicle #</th>
          <th>Weight (KG)</th>
          <th>Freight (PKR)</th>
        </tr>
      </thead>
      <tbody>
        {filtered.length === 0 ? (
          <tr>
            <td colSpan="8" className="rp-empty">
              <div className="rp-empty-icon">💰</div>No records found.
            </td>
          </tr>
        ) : (
          <>
            {filtered.map((d, i) => (
              <tr key={d.id || d.doNo || i}>
                <td className="rp-cell-sr">{i + 1}</td>
                <td className="rp-cell-id">{d.doNo || "—"}</td>
                <td className="rp-cell-date">{fmtDate(d.date)}</td>
                <td>
                  <div className="rp-cell-detail">
                    {d.sourceParty || "—"} / {d.destParty || "—"}
                  </div>
                </td>
                <td>{d.item || <span className="rp-cell-muted">—</span>}</td>
                <td className="rp-cell-muted">{d.vehicleNo || "—"}</td>
                <td className="rp-cell-num">{fmt(d.weight)}</td>
                <td className="rp-cell-num">{fmt(d.freight)}</td>
              </tr>
            ))}
            <tr className="rp-total-row">
              <td colSpan="6" style={{ textAlign:"right", color:"#7C3AED" }}>Total</td>
              <td className="rp-cell-num">{fmt(filtered.reduce((s, d) => s + (Number(d.weight) || 0), 0))}</td>
              <td className="rp-cell-num" style={{ color:"#7C3AED" }}>{fmt(filtered.reduce((s, d) => s + (Number(d.freight) || 0), 0))}</td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );

  /* ── Party table ── */
  const PartyTable = () => (
    <table className="rp-table">
      <thead>
        <tr>
          <th style={{ width:"40px", textAlign:"center" }}>#</th>
          <th>Party Name</th>
          <th>DO Count</th>
          <th>Total Weight (KG)</th>
          <th>Total Bags</th>
          <th>Total Freight (PKR)</th>
        </tr>
      </thead>
      <tbody>
        {partyLedger.length === 0 ? (
          <tr>
            <td colSpan="6" className="rp-empty">
              <div className="rp-empty-icon">👥</div>No party data found.
            </td>
          </tr>
        ) : (
          <>
            {partyLedger.map((r, i) => (
              <tr key={i}>
                <td className="rp-cell-sr">{i + 1}</td>
                <td style={{ fontWeight:600, color:"#0F172A" }}>{r.party}</td>
                <td className="rp-cell-num">{r.dos}</td>
                <td className="rp-cell-num">{fmt(r.weight)}</td>
                <td className="rp-cell-num">{fmt(r.bags)}</td>
                <td className="rp-cell-num">{fmt(r.freight)}</td>
              </tr>
            ))}
            <tr className="rp-total-row">
              <td colSpan="2" style={{ color:"#7C3AED" }}>Total</td>
              <td className="rp-cell-num">{partyLedger.reduce((s, r) => s + r.dos, 0)}</td>
              <td className="rp-cell-num">{fmt(partyLedger.reduce((s, r) => s + r.weight, 0))}</td>
              <td className="rp-cell-num">{fmt(partyLedger.reduce((s, r) => s + r.bags, 0))}</td>
              <td className="rp-cell-num" style={{ color:"#7C3AED" }}>{fmt(partyLedger.reduce((s, r) => s + r.freight, 0))}</td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );

  const recordCount = activeTab === "partywise" ? partyLedger.length : filtered.length;

  return (
    <div className="rp-root">
      {/* PAGE HEADER */}
      <div className="rp-page-header rp-no-print">
        <div className="rp-title-row">
          <div className="rp-bar" />
          <h1 className="rp-page-title">Reports</h1>
        </div>
        <div className="rp-page-sub">Analytics and summaries for delivery orders</div>
      </div>

      {/* STAT CARDS */}
      <div className="rp-stats rp-no-print">
        {[
          { label: "Total DOs",     value: total,      color: "#0F172A" },
          { label: "Pending",       value: pending,    color: "#2563EB", dot: "#2563EB" },
          { label: "In Transit",    value: transit,    color: "#B45309", dot: "#F59E0B" },
          { label: "Delivered",     value: delivered,  color: "#15803D", dot: "#22C55E" },
          { label: "No Movement",   value: noMovement, color: "#94A3B8", dot: "#94A3B8" },
          { label: "Freight (PKR)", value: freight.toLocaleString(), color: "#7C3AED", small: true },
        ].map(s => (
          <div className="rp-stat" key={s.label}>
            <div className="rp-stat-value" style={{ color: s.color, fontSize: s.small ? "18px" : undefined }}>{s.value}</div>
            <div className="rp-stat-label">
              {s.dot && <span className="rp-stat-dot" style={{ background: s.dot }} />}
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* TAB BAR */}
      <div className="rp-tabs rp-no-print">
        {TABS.map(t => (
          <button key={t.id} className={`rp-tab${activeTab === t.id ? " active" : ""}`} onClick={() => handleTab(t.id)}>
            <Ico d={t.icon} w={13} />{t.label}
          </button>
        ))}
      </div>

      {/* FILTER + ACTION BAR */}
      <div className="rp-filter-bar rp-no-print">
        <div className="rp-filter-field">
          <span className="rp-filter-label">From Date</span>
          <input className="rp-filter-input" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </div>
        <div className="rp-filter-field">
          <span className="rp-filter-label">To Date</span>
          <input className="rp-filter-input" type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        </div>
        <div className="rp-filter-field">
          <span className="rp-filter-label">Party Name</span>
          <input className="rp-filter-input" type="text" placeholder="Search party..." value={filterParty}
            onChange={e => setFilterParty(e.target.value)} style={{ width: "160px" }} />
        </div>
        <button className="rp-filter-btn rp-btn-apply" onClick={handleApply}>
          <Ico d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" w={13} />Apply
        </button>
        <button className="rp-filter-btn rp-btn-reset" onClick={handleReset}>
          <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" w={13} />Reset
        </button>
        <button className="rp-filter-btn rp-btn-export" onClick={handleExport} style={{ marginLeft: "auto" }}>
          <Ico d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" w={13} />Export CSV
        </button>
        <button className="rp-filter-btn rp-btn-print" onClick={handlePrint}>
          <Ico d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" w={13} />Print
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="rp-table-card rp-print-area">
        {/* Print Header */}
        <div className="rp-print-header">
          <div className="rp-print-title">VEHICLES DETAIL</div>
          <div className="rp-print-date">
            DATE {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).replace(/\//g, "-")} (UPDATED)
          </div>
        </div>

        <div className="rp-table-head rp-no-print">
          <div className="rp-table-head-left">
            <div className="rp-table-head-icon">
              <Ico d={TABS.find(t => t.id === activeTab)?.icon} w={15} color="white" />
            </div>
            <span className="rp-table-head-title">{tabLabel}</span>
          </div>
          <span className="rp-count-pill">{recordCount} records</span>
        </div>

        <div className="rp-table-wrap">
          {(activeTab === "daily" ||
            activeTab === "pending" ||
            activeTab === "delivered" ||
            activeTab === "nomovement") && <MainTable />}

          {activeTab === "freight" && <FreightTable />}
          {activeTab === "partywise" && <PartyTable />}
        </div>
      </div>
    </div>
  );
}
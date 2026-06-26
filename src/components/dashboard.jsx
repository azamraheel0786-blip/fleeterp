import { useState, useEffect } from "react";
import { getDOs }         from "../services/doservice";
import { getParties }     from "../services/partyservice";
import { getItems }       from "../services/itemservices";
import { getMovements }   from "../services/movementservice";

/* ─── STYLES ─────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .db-root {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #F1F5F9;
    padding: 0;
  }

  /* ── TOP BAR ── */
  .db-topbar {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    padding: 0 32px;
    height: 56px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .db-topbar-left { display: flex; align-items: center; gap: 10px; }
  .db-logo {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, #2563EB, #7C3AED);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #fff; letter-spacing: 0.03em;
  }
  .db-app-name { font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: 0.01em; }
  .db-app-sub  { font-size: 11px; color: #475569; margin-left: 2px; font-weight: 400; }
  .db-topbar-right { display: flex; align-items: center; gap: 12px; }
  .db-date-pill {
    font-size: 11.5px; color: #94A3B8; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 7px;
    padding: 4px 10px; font-variant-numeric: tabular-nums;
  }
  .db-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, #2563EB, #7C3AED);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff;
  }

  /* ── BODY ── */
  .db-body { padding: 28px 32px; }

  /* ── SECTION LABEL ── */
  .db-section-label {
    font-size: 10px; font-weight: 700; color: #94A3B8;
    text-transform: uppercase; letter-spacing: 0.12em;
    margin-bottom: 12px; margin-top: 24px;
  }
  .db-section-label:first-child { margin-top: 0; }

  /* ── KPI STRIP ── */
  .db-kpi-strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 14px;
  }
  .db-kpi {
    background: #fff;
    border: 1px solid #E8EDF5;
    border-radius: 14px;
    padding: 18px 20px;
    box-shadow: 0 1px 6px rgba(15,23,42,0.04);
    position: relative; overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .db-kpi:hover { box-shadow: 0 6px 20px rgba(15,23,42,0.09); transform: translateY(-1px); }
  .db-kpi-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    border-radius: 14px 14px 0 0;
  }
  .db-kpi-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
  }
  .db-kpi-value {
    font-size: 28px; font-weight: 800; color: #0F172A;
    line-height: 1; font-variant-numeric: tabular-nums;
  }
  .db-kpi-label { font-size: 12px; color: #94A3B8; margin-top: 5px; font-weight: 500; }
  .db-kpi-sub   { font-size: 11px; color: #CBD5E1; margin-top: 2px; }

  /* ── TWO COL LAYOUT ── */
  .db-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  /* ── CARD ── */
  .db-card {
    background: #fff;
    border: 1px solid #E8EDF5;
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(15,23,42,0.04);
    overflow: hidden;
    animation: db-rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes db-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .db-card-head {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
    padding: 13px 18px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .db-card-head-left { display: flex; align-items: center; gap: 9px; }
  .db-card-head-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .db-card-head-title { font-size: 12.5px; font-weight: 600; color: #fff; }
  .db-card-badge {
    font-size: 10px; font-weight: 700;
    padding: 2px 8px; border-radius: 99px;
    background: rgba(255,255,255,0.08); color: #94A3B8;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .db-card-body { padding: 16px 18px; }

  /* ── RECENT DOs TABLE ── */
  table.db-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  table.db-table th {
    padding: 8px 12px; text-align: left;
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: #94A3B8; background: #F8FAFC;
    border-bottom: 1px solid #F1F5F9;
  }
  table.db-table td { padding: 10px 12px; border-bottom: 1px solid #F8FAFC; }
  table.db-table tr:last-child td { border-bottom: none; }
  table.db-table tbody tr { transition: background 0.1s; }
  table.db-table tbody tr:hover { background: #F8FAFC; }
  .db-cell-id    { color: #2563EB; font-weight: 700; font-variant-numeric: tabular-nums; }
  .db-cell-date  { color: #94A3B8; font-variant-numeric: tabular-nums; }
  .db-cell-party { color: #374151; }
  .db-cell-muted { color: #CBD5E1; }

  /* ── BADGE ── */
  .db-badge {
    display: inline-block; padding: 2px 9px; border-radius: 99px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.03em;
  }
  .db-badge-pending   { background: #EFF6FF; color: #2563EB; }
  .db-badge-transit   { background: #FFFBEB; color: #B45309; }
  .db-badge-delivered { background: #F0FDF4; color: #15803D; }
  .db-badge-default   { background: #F1F5F9; color: #64748B; }

  /* ── STATUS BAR ── */
  .db-status-bar-wrap { margin: 4px 0 14px; }
  .db-status-bar {
    display: flex; height: 8px; border-radius: 99px; overflow: hidden; gap: 2px;
  }
  .db-status-bar-seg { border-radius: 99px; transition: flex 0.4s ease; }
  .db-status-legend  { display: flex; gap: 16px; margin-top: 10px; flex-wrap: wrap; }
  .db-status-legend-item { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: #64748B; }
  .db-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* ── MOVEMENT LIST ── */
  .db-movement-list { display: flex; flex-direction: column; }
  .db-movement-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid #F8FAFC;
  }
  .db-movement-row:last-child { border-bottom: none; }
  .db-movement-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
  .db-movement-do   { font-size: 12px; font-weight: 700; color: #0F172A; }
  .db-movement-info { font-size: 11.5px; color: #64748B; margin-top: 2px; }
  .db-movement-time { font-size: 11px; color: #CBD5E1; margin-left: auto; white-space: nowrap; padding-top: 2px; }

  /* ── MODULE SHORTCUTS ── */
  .db-shortcuts {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px;
  }
  .db-shortcut {
    background: #fff; border: 1px solid #E8EDF5; border-radius: 13px;
    padding: 14px 16px; cursor: pointer;
    display: flex; align-items: center; gap: 10px;
    transition: all 0.18s; box-shadow: 0 1px 4px rgba(15,23,42,0.04);
  }
  .db-shortcut:hover {
    border-color: #CBD5E1; box-shadow: 0 4px 14px rgba(15,23,42,0.08);
    transform: translateY(-1px);
  }
  .db-shortcut:active { transform: scale(0.98); }
  .db-shortcut-icon {
    width: 34px; height: 34px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .db-shortcut-label { font-size: 12px; font-weight: 600; color: #374151; line-height: 1.3; }
  .db-shortcut-sub   { font-size: 10.5px; color: #94A3B8; margin-top: 1px; }

  /* ── BREAKDOWN CARD ── */
  .db-breakdown-card { margin-top: 16px; margin-bottom: 0; }

  /* ── EMPTY ── */
  .db-empty { text-align: center; padding: 28px 16px; color: #CBD5E1; font-size: 12.5px; }

  @media (max-width: 768px) {
    .db-body    { padding: 20px 16px; }
    .db-two-col { grid-template-columns: 1fr; }
    .db-topbar  { padding: 0 16px; }
  }
`;

/* ─── HELPERS ─────────────────────────────────────────────────────────── */
const Badge = ({ status }) => {
  const map = { Pending: "pending", Transit: "transit", Delivered: "delivered" };
  const cls = map[status] || "default";
  return <span className={`db-badge db-badge-${cls}`}>{status || "—"}</span>;
};

const Ico = ({ d, w = 14, color = "currentColor" }) => (
  <svg width={w} height={w} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const fmtDate = (str) => {
  if (!str) return "—";
  try { return new Date(str).toLocaleDateString("en-PK", { day: "2-digit", month: "short" }); }
  catch { return str; }
};

const fmtDateTime = (str) => {
  if (!str) return "—";
  try { return new Date(str).toLocaleString("en-PK", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
  catch { return str; }
};

const todayStr = () => new Date().toLocaleDateString("en-PK", {
  weekday: "short", day: "numeric", month: "long", year: "numeric"
});

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function Dashboard({ onNavigate }) {
  const [dos,       setDos]       = useState([]);
  const [movements, setMovements] = useState([]);
  const [parties,   setParties]   = useState([]);
  const [items,     setItems]     = useState([]);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

useEffect(() => {
  const load = async () => {
    const [dos, movements, parties, items] = await Promise.all([
      getDOs(), getMovements(), getParties(), getItems()
    ]);
    setDos(dos);
    setMovements(movements);
    setParties(parties);
    setItems(items);
  };
  load();
}, []);

  /* ── STATS ── */
  const total     = dos.length;
  const pending   = dos.filter(d => d.status === "Pending" || !d.status).length;
  const transit   = dos.filter(d => d.status === "Transit").length;
  const delivered = dos.filter(d => d.status === "Delivered").length;
  const freight   = dos.reduce((s, d) => s + (Number(d.freight) || 0), 0);
  const pctPending   = total ? Math.round((pending   / total) * 100) : 0;
  const pctTransit   = total ? Math.round((transit   / total) * 100) : 0;
  const pctDelivered = total ? Math.round((delivered / total) * 100) : 0;

 const recentDOs       = Array.isArray(dos)      ? [...dos].reverse().slice(0, 6)      : [];
const recentMovements = Array.isArray(movements) ? [...movements].reverse().slice(0, 5): [];
  const statusColor     = { Pending: "#2563EB", Transit: "#F59E0B", Delivered: "#22C55E" };

  const shortcuts = [
    { label: "Masters",          sub: "Parties & items",    tab: "masters",  bg: "#EFF6FF", ic: "#2563EB", d: "M4 7h16M4 12h16M4 17h10" },
    { label: "DO Entry",         sub: "New delivery order", tab: "doentry",  bg: "#F0FDF4", ic: "#16A34A", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Vehicle Movement", sub: "Update status",      tab: "vehicle",  bg: "#FFFBEB", ic: "#B45309", d: "M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h2m6 12h3a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5h8v14H8V5z" },
    { label: "Reports",          sub: "View analytics",     tab: "reports",  bg: "#F5F3FF", ic: "#7C3AED", d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  ];

  return (
    <div className="db-root">

      {/* TOP BAR */}
      <div className="db-topbar">
        <div className="db-topbar-left">
          <div className="db-logo">LT</div>
          <span className="db-app-name">LogiTrack</span>
          <span className="db-app-sub">ERP</span>
        </div>
        <div className="db-topbar-right">
          <div className="db-date-pill">{todayStr()}</div>
          <div className="db-avatar">A</div>
        </div>
      </div>

      <div className="db-body">

        {/* KPI STRIP */}
        <div className="db-section-label">Overview</div>
        <div className="db-kpi-strip">

          <div className="db-kpi">
            <div className="db-kpi-accent" style={{ background: "linear-gradient(90deg,#2563EB,#6366F1)" }}/>
            <div className="db-kpi-icon" style={{ background: "#EFF6FF" }}>
              <Ico d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" color="#2563EB" />
            </div>
            <div className="db-kpi-value">{total}</div>
            <div className="db-kpi-label">Total DOs</div>
          </div>

          <div className="db-kpi">
            <div className="db-kpi-accent" style={{ background: "#2563EB" }}/>
            <div className="db-kpi-icon" style={{ background: "#EFF6FF" }}>
              <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="#2563EB" />
            </div>
            <div className="db-kpi-value" style={{ color: "#2563EB" }}>{pending}</div>
            <div className="db-kpi-label">Pending</div>
            <div className="db-kpi-sub">{pctPending}% of total</div>
          </div>

          <div className="db-kpi">
            <div className="db-kpi-accent" style={{ background: "#F59E0B" }}/>
            <div className="db-kpi-icon" style={{ background: "#FFFBEB" }}>
              <Ico d="M8 17H5a2 2 0 01-2-2V7a2 2 0 012-2h2m6 12h3a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5h8v14H8V5z" color="#B45309" />
            </div>
            <div className="db-kpi-value" style={{ color: "#B45309" }}>{transit}</div>
            <div className="db-kpi-label">In Transit</div>
            <div className="db-kpi-sub">{pctTransit}% of total</div>
          </div>

          <div className="db-kpi">
            <div className="db-kpi-accent" style={{ background: "#22C55E" }}/>
            <div className="db-kpi-icon" style={{ background: "#F0FDF4" }}>
              <Ico d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="#16A34A" />
            </div>
            <div className="db-kpi-value" style={{ color: "#16A34A" }}>{delivered}</div>
            <div className="db-kpi-label">Delivered</div>
            <div className="db-kpi-sub">{pctDelivered}% of total</div>
          </div>

          <div className="db-kpi">
            <div className="db-kpi-accent" style={{ background: "linear-gradient(90deg,#7C3AED,#6366F1)" }}/>
            <div className="db-kpi-icon" style={{ background: "#F5F3FF" }}>
              <Ico d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="#7C3AED" />
            </div>
            <div className="db-kpi-value" style={{ color: "#7C3AED", fontSize: "20px", paddingTop: "5px" }}>
              {freight.toLocaleString()}
            </div>
            <div className="db-kpi-label">Freight (PKR)</div>
          </div>

          <div className="db-kpi">
            <div className="db-kpi-accent" style={{ background: "#64748B" }}/>
            <div className="db-kpi-icon" style={{ background: "#F8FAFC" }}>
              <Ico d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" color="#64748B" />
            </div>
            <div className="db-kpi-value" style={{ fontSize: "22px", paddingTop: "4px" }}>
              {parties.length}
              <span style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 500, marginLeft: "5px" }}>
                / {items.length} items
              </span>
            </div>
            <div className="db-kpi-label">Parties</div>
          </div>

        </div>

        {/* BREAKDOWN BAR */}
        {total > 0 && (
          <div className="db-card db-breakdown-card">
            <div className="db-card-head">
              <div className="db-card-head-left">
                <div className="db-card-head-icon" style={{ background: "rgba(99,102,241,0.25)" }}>
                  <Ico d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" w={14} color="white" />
                </div>
                <span className="db-card-head-title">Delivery Breakdown</span>
              </div>
              <span className="db-card-badge">{total} total orders</span>
            </div>
            <div className="db-card-body">
              <div className="db-status-bar">
                {pending   > 0 && <div className="db-status-bar-seg" style={{ flex: pending,   background: "#2563EB" }} />}
                {transit   > 0 && <div className="db-status-bar-seg" style={{ flex: transit,   background: "#F59E0B" }} />}
                {delivered > 0 && <div className="db-status-bar-seg" style={{ flex: delivered, background: "#22C55E" }} />}
              </div>
              <div className="db-status-legend">
                <div className="db-status-legend-item"><div className="db-legend-dot" style={{ background: "#2563EB" }}/>Pending ({pending})</div>
                <div className="db-status-legend-item"><div className="db-legend-dot" style={{ background: "#F59E0B" }}/>In Transit ({transit})</div>
                <div className="db-status-legend-item"><div className="db-legend-dot" style={{ background: "#22C55E" }}/>Delivered ({delivered})</div>
              </div>
            </div>
          </div>
        )}

        {/* RECENT ACTIVITY */}
        <div className="db-section-label">Activity</div>
        <div className="db-two-col">

          <div className="db-card">
            <div className="db-card-head">
              <div className="db-card-head-left">
                <div className="db-card-head-icon" style={{ background: "rgba(37,99,235,0.25)" }}>
                  <Ico d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" w={14} color="white" />
                </div>
                <span className="db-card-head-title">Recent Delivery Orders</span>
              </div>
              <span className="db-card-badge">Last {recentDOs.length}</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="db-table">
                <thead>
                  <tr>{["DO No","Date","Source","Destination","Status"].map(h=><th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {recentDOs.length === 0
                    ? <tr><td colSpan="5" className="db-empty">No delivery orders yet.</td></tr>
                    : recentDOs.map(d => (
                      <tr key={d.id}>
                        <td className="db-cell-id">{d.doNo}</td>
                        <td className="db-cell-date">{fmtDate(d.date)}</td>
                        <td className="db-cell-party">{d.sourceParty || <span className="db-cell-muted">—</span>}</td>
                        <td className="db-cell-party">{d.destParty   || <span className="db-cell-muted">—</span>}</td>
                        <td><Badge status={d.status} /></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div className="db-card">
            <div className="db-card-head">
              <div className="db-card-head-left">
                <div className="db-card-head-icon" style={{ background: "rgba(245,158,11,0.25)" }}>
                  <Ico d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" w={14} color="white" />
                </div>
                <span className="db-card-head-title">Recent Vehicle Movements</span>
              </div>
              <span className="db-card-badge">Last {recentMovements.length}</span>
            </div>
            <div className="db-card-body">
              {recentMovements.length === 0
                ? <div className="db-empty">No movement records yet.</div>
                : <div className="db-movement-list">
                    {recentMovements.map(m => (
                      <div key={m.id} className="db-movement-row">
                        <div className="db-movement-dot" style={{ background: statusColor[m.status] || "#94A3B8" }} />
                        <div>
                          <div className="db-movement-do">{m.doNo}</div>
                          <div className="db-movement-info">
                            {m.driverName || "—"}
                            {m.status && <> · <Badge status={m.status} /></>}
                            {m.remarks && <> · {m.remarks}</>}
                          </div>
                        </div>
                        <div className="db-movement-time">{fmtDateTime(m.entryDateTime)}</div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>

        </div>

        {/* QUICK ACCESS */}
        <div className="db-section-label">Quick Access</div>
        <div className="db-shortcuts">
          {shortcuts.map(s => (
            <div key={s.tab} className="db-shortcut" onClick={() => onNavigate && onNavigate(s.tab)}>
              <div className="db-shortcut-icon" style={{ background: s.bg }}>
                <Ico d={s.d} color={s.ic} />
              </div>
              <div>
                <div className="db-shortcut-label">{s.label}</div>
                <div className="db-shortcut-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
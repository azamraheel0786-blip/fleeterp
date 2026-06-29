import { useState } from "react";
import Dashboard from "./dashboard";
import Parties   from "./parties";
import Items     from "./items";
import Statuses  from "./statuses";
import DOEntry   from "./doentry";
import VM        from "./vehiclemovement";
import Reports   from "./reports";
import { logout } from "../auth";
import { useNavigate } from "react-router-dom";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .ly-root { display: flex; min-height: 100vh; font-family: 'Inter', sans-serif; background: #F1F5F9; }
  .ly-sidebar { width: 230px; flex-shrink: 0; background: #0F172A; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
  .ly-brand { padding: 22px 20px 18px; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 11px; }
  .ly-brand-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(37,99,235,0.35); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ly-brand-name { font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }
  .ly-brand-sub  { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 1px; letter-spacing: 0.04em; text-transform: uppercase; }
  .ly-nav { flex: 1; padding: 14px 10px; overflow-y: auto; }
  .ly-nav-section-label { font-size: 9.5px; font-weight: 700; color: rgba(255,255,255,0.28); text-transform: uppercase; letter-spacing: 0.1em; padding: 0 10px; margin: 12px 0 6px; }
  .ly-nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; margin-bottom: 2px; transition: background 0.15s; position: relative; }
  .ly-nav-item:hover { background: rgba(255,255,255,0.07); }
  .ly-nav-item.active { background: rgba(37,99,235,0.22); }
  .ly-nav-item.active::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; border-radius: 0 2px 2px 0; background: #3B82F6; }
  .ly-nav-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; background: rgba(255,255,255,0.05); transition: background 0.15s; }
  .ly-nav-item.active .ly-nav-icon { background: rgba(37,99,235,0.35); }
  .ly-nav-item:hover  .ly-nav-icon { background: rgba(255,255,255,0.09); }
  .ly-nav-label { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6); transition: color 0.15s; flex: 1; }
  .ly-nav-item.active .ly-nav-label { color: #fff; font-weight: 600; }
  .ly-nav-item:hover  .ly-nav-label { color: rgba(255,255,255,0.85); }
  .ly-chevron { color: rgba(255,255,255,0.3); transition: transform 0.22s, color 0.15s; flex-shrink: 0; display: flex; align-items: center; }
  .ly-nav-item:hover .ly-chevron { color: rgba(255,255,255,0.5); }
  .ly-chevron.open { transform: rotate(180deg); color: rgba(255,255,255,0.6); }
  .ly-dropdown { overflow: hidden; transition: max-height 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.2s; max-height: 0; opacity: 0; }
  .ly-dropdown.open { max-height: 200px; opacity: 1; }
  .ly-child { display: flex; align-items: center; gap: 8px; padding: 7px 12px 7px 22px; border-radius: 8px; margin-bottom: 1px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: background 0.15s; position: relative; }
  .ly-child:hover { background: rgba(255,255,255,0.06); }
  .ly-child.active { background: rgba(37,99,235,0.18); }
  .ly-child.active::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; border-radius: 0 2px 2px 0; background: #3B82F6; }
  .ly-child-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.18); flex-shrink: 0; transition: background 0.15s; }
  .ly-child.active .ly-child-dot { background: #3B82F6; }
  .ly-child:hover  .ly-child-dot { background: rgba(255,255,255,0.35); }
  .ly-child-label { font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,0.5); transition: color 0.15s; }
  .ly-child.active .ly-child-label { color: #fff; font-weight: 600; }
  .ly-child:hover  .ly-child-label { color: rgba(255,255,255,0.8); }
  .ly-sidebar-footer { padding: 14px 10px; border-top: 1px solid rgba(255,255,255,0.07); }
  .ly-user { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; cursor: pointer; transition: background 0.15s; }
  .ly-user:hover { background: rgba(255,255,255,0.07); }
  .ly-avatar { width: 30px; height: 30px; border-radius: 8px; background: linear-gradient(135deg, #2563EB, #6366F1); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .ly-user-name { font-size: 12.5px; font-weight: 600; color: rgba(255,255,255,0.75); }
  .ly-user-role { font-size: 10.5px; color: rgba(255,255,255,0.35); }
  .ly-main { margin-left: 230px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .ly-topbar { height: 56px; background: #fff; border-bottom: 1px solid #E8EDF5; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 3px rgba(15,23,42,0.04); }
  .ly-topbar-left { display: flex; align-items: center; gap: 8px; }
  .ly-breadcrumb-sep  { color: #CBD5E1; font-size: 13px; }
  .ly-breadcrumb-root { font-size: 13px; color: #94A3B8; }
  .ly-breadcrumb-cur  { font-size: 13px; font-weight: 600; color: #0F172A; }
  .ly-topbar-right { display: flex; align-items: center; gap: 10px; }
  .ly-topbar-pill { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 99px; background: #F0FDF4; border: 1px solid #BBF7D0; font-size: 11px; font-weight: 600; color: #15803D; }
  .ly-topbar-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: #22C55E; animation: ly-blink 2s ease-in-out infinite; }
  @keyframes ly-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  .ly-content { flex: 1; }
  .ly-overlay { display: none; position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 99; backdrop-filter: blur(2px); }
  .ly-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: #475569; transition: background 0.15s; }
  .ly-hamburger:hover { background: #F1F5F9; }
  @media (max-width: 768px) {
    .ly-sidebar { transform: translateX(-100%); }
    .ly-sidebar.open { transform: translateX(0); }
    .ly-main { margin-left: 0; }
    .ly-hamburger { display: flex; }
    .ly-overlay.open { display: block; }
    .ly-topbar { padding: 0 16px; }
  }
`;

const MASTERS_CHILDREN = [
  { id: "parties",  label: "Parties",  dot: "#22C55E" },
  { id: "items",    label: "Items",    dot: "#F59E0B" },
  { id: "statuses", label: "Statuses", dot: "#A855F7" },
];

const MENU = [
  { id: "dashboard", label: "Dashboard",       icon: "⊞", section: "Overview" },
  { id: "masters",   label: "Masters",          icon: "☰", section: "Management", dropdown: true },
  { id: "doentry",   label: "DO Entry",         icon: "📋", section: "Management" },
  { id: "vehicle",   label: "Vehicle Movement", icon: "🚛", section: "Management" },
  { id: "reports",   label: "Reports",          icon: "📊", section: "Analytics" },
];

const MASTER_IDS = new Set(["parties", "items", "statuses"]);

export default function Layout() {
  const [tab,         setTab]         = useState("dashboard");
  const [mastersOpen, setMastersOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  if (!document.getElementById("ly-styles")) {
    const el = document.createElement("style");
    el.id = "ly-styles"; el.textContent = CSS;
    document.head.appendChild(el);
  }

  const handleNav = (id) => {
    if (id === "masters") { setMastersOpen(v => !v); return; }
    setTab(id);
    if (!MASTER_IDS.has(id)) setMastersOpen(false);
    setSidebarOpen(false);
  };

  const handleChild = (id) => { setTab(id); setSidebarOpen(false); };

  const getBreadcrumb = () => {
    if (MASTER_IDS.has(tab)) {
      const child = MASTERS_CHILDREN.find(c => c.id === tab);
      return `Masters / ${child?.label ?? ""}`;
    }
    return MENU.find(m => m.id === tab)?.label ?? "";
  };

  const renderContent = () => {
    switch (tab) {
case "dashboard": return <Dashboard onNavigate={handleNav} />;
      case "parties":   return <Parties />;
      case "items":     return <Items />;
      case "statuses":  return <Statuses />;
      case "doentry":   return <DOEntry key={tab} />;
      case "vehicle":   return <VM />;
      case "reports":   return <Reports />;
      default:          return null;
    }
  };

  const sections = [...new Set(MENU.map(m => m.section))];
  const isMastersActive = MASTER_IDS.has(tab);

  return (
    <div className="ly-root">
      <aside className={`ly-sidebar${sidebarOpen ? " open" : ""}`}>

        <div className="ly-brand">
          <div className="ly-brand-icon">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M4 21V10l5-3v3l5-3v3l5-3v11M9 21v-4h6v4" />
            </svg>
          </div>
          <div>
            <div className="ly-brand-name">FleetERP</div>
            <div className="ly-brand-sub">Management System</div>
          </div>
        </div>

        <nav className="ly-nav">
          {sections.map(section => (
            <div key={section}>
              <div className="ly-nav-section-label">{section}</div>
              {MENU.filter(m => m.section === section).map(item => (
                <div key={item.id}>
                  <button
                    className={`ly-nav-item${
                      item.dropdown
                        ? (isMastersActive || mastersOpen) ? " active" : ""
                        : tab === item.id ? " active" : ""
                    }`}
                    onClick={() => handleNav(item.id)}
                  >
                    <span className="ly-nav-icon">{item.icon}</span>
                    <span className="ly-nav-label">{item.label}</span>
                    {item.dropdown && (
                      <span className={`ly-chevron${mastersOpen ? " open" : ""}`}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    )}
                  </button>

                  {item.dropdown && (
                    <div className={`ly-dropdown${mastersOpen ? " open" : ""}`}>
                      {MASTERS_CHILDREN.map(child => (
                        <button
                          key={child.id}
                          className={`ly-child${tab === child.id ? " active" : ""}`}
                          onClick={() => handleChild(child.id)}
                        >
                          <span
                            className="ly-child-dot"
                            style={tab === child.id ? { background: child.dot } : {}}
                          />
                          <span className="ly-child-label">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="ly-sidebar-footer">
          <div className="ly-user">
            <div className="ly-avatar">A</div>
            <div style={{ flex: 1 }}>
              <div className="ly-user-name">Admin</div>
              <div className="ly-user-role">System Administrator</div>
            </div>
            <button
              onClick={handleLogout} title="Logout"
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", padding: "4px", borderRadius: "6px", display: "flex", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#F87171"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className={`ly-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <div className="ly-main">
        <header className="ly-topbar">
          <div className="ly-topbar-left">
            <button className="ly-hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Menu">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="3" y1="6"  x2="21" y2="6"  />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="ly-breadcrumb-root">FleetERP</span>
            <span className="ly-breadcrumb-sep">/</span>
            <span className="ly-breadcrumb-cur">{getBreadcrumb()}</span>
          </div>
          <div className="ly-topbar-right">
            <div className="ly-topbar-pill">
              <span className="ly-topbar-pill-dot" />
              System Online
            </div>
          </div>
        </header>

        <main className="ly-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
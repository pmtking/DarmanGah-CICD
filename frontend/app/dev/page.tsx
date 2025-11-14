"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "react-flow-renderer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// انواع داده‌ها
type System = { id: string; name: string; status: "Online" | "Offline"; load: number };
type LogItem = {
  id: string;
  time: string;
  level: "INFO" | "WARN" | "ERROR" | "ALERT";
  source: "Agent" | "Browser" | "Network" | "System";
  message: string;
  meta?: Record<string, any>;
};

// رنگ‌ها/استایل سطح امنیت
const levelColor: Record<LogItem["level"], string> = {
  INFO: "#80cbc4",
  WARN: "#ffb74d",
  ERROR: "#ef5350",
  ALERT: "#64b5f6",
};

const glass = (glow = "rgba(0,229,255,0.35)") => ({
  background: "rgba(255,255,255,0.06)",
  borderRadius: "12px",
  padding: "16px",
  backdropFilter: "blur(14px)",
  boxShadow: `0 0 24px ${glow}`,
  border: "1px solid rgba(255,255,255,0.15)",
});

// کامپوننت اصلی
export default function Devdashboard() {
  // داده‌های نمودار
  const [metrics, setMetrics] = useState<{ time: string; cpu: number; memory: number }[]>([]);
  // سیستم‌ها
  const [systems, setSystems] = useState<System[]>([
    { id: "1", name: "Auth Service", status: "Online", load: 20 },
    { id: "2", name: "Database", status: "Online", load: 35 },
    { id: "3", name: "API Gateway", status: "Offline", load: 0 },
    { id: "4", name: "Cache Server", status: "Online", load: 50 },
  ]);
  // لاگ‌ها
  const [logs, setLogs] = useState<LogItem[]>([]);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // اسکرول اتوماتیک لاگ‌ها
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // شبیه‌سازی مانیتورینگ
  useEffect(() => {
    const interval = setInterval(() => {
      const cpu = Math.floor(Math.random() * 100);
      const memory = Math.floor(Math.random() * 100);
      const time = new Date().toLocaleTimeString();

      setMetrics((prev) => [...prev.slice(-9), { time, cpu, memory }]);

      setSystems((prev) =>
        prev.map((sys) => {
          const wentOffline = Math.random() < 0.15;
          const status = wentOffline ? "Offline" : "Online";
          const load = status === "Offline" ? 0 : Math.floor(Math.random() * 100);

          // لاگ تغییر وضعیت
          if (wentOffline) {
            pushLog({
              level: "WARN",
              source: "Agent",
              message: `${sys.name} went Offline`,
              meta: { id: sys.id, prevStatus: sys.status, newStatus: status },
            });
          } else if (load > 85) {
            pushLog({
              level: "INFO",
              source: "Agent",
              message: `${sys.name} high load detected`,
              meta: { id: sys.id, load },
            });
          }

          return { ...sys, status, load };
        })
      );

      // لاگ منابع غیرعادی
      if (cpu > 90) {
        pushLog({
          level: "ALERT",
          source: "System",
          message: "CPU anomaly pattern detected",
          meta: { cpu, pattern: "spike" },
        });
      }
      if (memory > 90) {
        pushLog({
          level: "ERROR",
          source: "System",
          message: "Memory saturation risk",
          meta: { memory, threshold: 90 },
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // تابع افزودن لاگ
  const pushLog = (item: Omit<LogItem, "id" | "time">) => {
    const log: LogItem = {
      id: crypto.randomUUID(),
      time: new Date().toLocaleTimeString(),
      ...item,
    };
    setLogs((prev) => [...prev.slice(-199), log]);
  };

  // نودها (چینش دایره‌ای)
  const radius = 220;
  const centerX = 430;
  const centerY = 300;

  const nodes = useMemo(
    () => [
      {
        id: "mother",
        data: { label: "🛡️ Mother Node" },
        position: { x: centerX, y: centerY },
        style: {
          background: "rgba(30,136,229,0.25)",
          color: "#fff",
          padding: 16,
          borderRadius: 16,
          border: "2px solid #00e5ff",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 28px rgba(0,229,255,0.7)",
        },
      },
      ...systems.map((sys, idx) => {
        const angle = (idx / systems.length) * 2 * Math.PI;
        return {
          id: sys.id,
          data: { label: `${sys.name} • ${sys.status} • ${sys.load}%` },
          position: {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
          },
          style: {
            background: sys.status === "Online" ? "rgba(67,160,71,0.22)" : "rgba(229,57,53,0.22)",
            color: "#fff",
            padding: 14,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.25)",
            backdropFilter: "blur(10px)",
            boxShadow:
              sys.status === "Online"
                ? "0 0 22px rgba(67,160,71,0.7)"
                : "0 0 22px rgba(229,57,53,0.7)",
          },
        };
      }),
    ],
    [systems]
  );

  const edges = useMemo(
    () =>
      systems.map((sys) => ({
        id: `e${sys.id}-mother`,
        source: sys.id,
        target: "mother",
        animated: true,
        style: { stroke: sys.status === "Online" ? "#00e5ff" : "#ef5350", strokeWidth: 2 },
      })),
    [systems]
  );

  // شبیه‌ساز جست‌وجوی مرورگر
  const [query, setQuery] = useState("");
  const [engine, setEngine] = useState<"Google" | "Bing" | "DuckDuckGo">("Google");
  const [results, setResults] = useState<
    { title: string; url: string; snippet: string; risk: "Low" | "Medium" | "High" }[]
  >([]);

  const runSearch = () => {
    if (!query.trim()) return;

    // ساخت نتایج جعلی با سطح ریسک
    const base = [
      {
        title: `${query} overview`,
        url: `https://example.com/${query.replace(/\s+/g, "-")}`,
        snippet: `An overview and documentation about ${query}.`,
        risk: "Low" as const,
      },
      {
        title: `${query} tutorial`,
        url: `https://docs.example.com/${query}`,
        snippet: `Step-by-step tutorial for ${query}.`,
        risk: "Low" as const,
      },
      {
        title: `${query} cracked download`,
        url: `http://unsafe.download/${query}`,
        snippet: `Free download, cracked version. Potentially harmful.`,
        risk: "High" as const,
      },
      {
        title: `best ${query} alternatives`,
        url: `https://compare.example.com/${query}`,
        snippet: `Comparison of ${query} alternatives.`,
        risk: "Medium" as const,
      },
    ];

    // لاگ درخواست جست‌وجو
    pushLog({
      level: "INFO",
      source: "Browser",
      message: `Search requested: "${query}" on ${engine}`,
      meta: { query, engine },
    });

    // لاگ ریسک نتایج
    const risky = base.filter((r) => r.risk !== "Low");
    if (risky.length) {
      pushLog({
        level: "WARN",
        source: "Browser",
        message: `Risky results detected for query "${query}"`,
        meta: { riskyCount: risky.length, risks: risky.map((r) => r.risk) },
      });
    }

    setResults(base);
  };

  // کلیک روی نتیجه
  const handleResultClick = (r: { title: string; url: string; risk: "Low" | "Medium" | "High" }) => {
    pushLog({
      level: r.risk === "High" ? "ERROR" : r.risk === "Medium" ? "WARN" : "INFO",
      source: "Browser",
      message: `Result clicked: ${r.title}`,
      meta: { url: r.url, risk: r.risk },
    });
    // شبیه‌سازی Navigation
    pushLog({
      level: "INFO",
      source: "Network",
      message: `Navigating to ${new URL(r.url, "https://").href}`,
      meta: { status: 200, method: "GET" },
    });
  };

  return (
    <div
      style={{
        background:
          "radial-gradient(1200px 600px at 20% 10%, rgba(0,229,255,0.06), transparent), radial-gradient(1200px 600px at 80% 90%, rgba(255,64,129,0.06), transparent), #0a0f14",
        minHeight: "100vh",
        color: "#eaeef2",
        padding: "24px",
        fontFamily: "ui-sans-serif, system-ui, -apple-system",
      }}
    >
      <h1 style={{ marginBottom: 8, textShadow: "0 0 16px #00e5ff" }}>Security Monitoring Center</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>Real-time metrics, node topology, logs, and browser search simulator.</p>

      {/* ردیف بالا: نمودار + شبیه‌ساز جست‌وجو */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* نمودار */}
        <div style={glass("rgba(0,229,255,0.25)")}>
          <h3 style={{ marginBottom: 12 }}>Live Metrics</h3>
          <LineChart width={600} height={300} data={metrics} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#29414a" />
            <XAxis dataKey="time" stroke="#cfd8dc" />
            <YAxis stroke="#cfd8dc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="cpu" stroke="#00e5ff" name="CPU %" />
            <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory %" />
          </LineChart>
        </div>

        {/* شبیه‌ساز جست‌وجوی مرورگر */}
        <div style={glass("rgba(255,64,129,0.25)")}>
          <h3 style={{ marginBottom: 12 }}>Browser Search Simulator</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value as any)}
              style={{
                flex: "0 0 180px",
                padding: "10px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <option>Google</option>
              <option>Bing</option>
              <option>DuckDuckGo</option>
            </select>
            <input
              placeholder="Type your query…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <button
              onClick={runSearch}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                background: "linear-gradient(90deg,#00e5ff,#64b5f6)",
                color: "#031a21",
                fontWeight: 700,
                border: "none",
                boxShadow: "0 0 16px rgba(0,229,255,0.5)",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>

          {/* نتایج جست‌وجو */}
          <div style={{ display: "grid", gap: 12 }}>
            {results.map((r) => (
              <div
                key={r.url}
                style={{
                  ...glass(r.risk === "High" ? "rgba(239,83,80,0.35)" : r.risk === "Medium" ? "rgba(255,183,77,0.3)" : "rgba(128,203,196,0.25)"),
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  padding: "12px 16px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{r.title}</div>
                  <div style={{ opacity: 0.8, fontSize: 13 }}>{r.snippet}</div>
                  <div style={{ opacity: 0.8, fontSize: 12, marginTop: 6 }}>{r.url}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      background:
                        r.risk === "High"
                          ? "rgba(239,83,80,0.25)"
                          : r.risk === "Medium"
                          ? "rgba(255,183,77,0.25)"
                          : "rgba(128,203,196,0.25)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    Risk: {r.risk}
                  </div>
                  <button
                    onClick={() => handleResultClick(r)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.15)",
                      cursor: "pointer",
                    }}
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* نقشه نودها */}
      <h3 style={{ marginTop: 22, textShadow: "0 0 14px #00e5ff" }}>Node Topology</h3>
      <div style={{ height: 560, ...glass("rgba(0,229,255,0.25)") }}>
        <ReactFlow nodes={nodes} edges={edges}>
          <MiniMap nodeColor={(n) => (n.style?.background || "#999")} />
          <Controls />
          <Background color="#1f2a31" gap={22} />
        </ReactFlow>
      </div>

      {/* پنل لاگ‌ها */}
      <h3 style={{ marginTop: 22, textShadow: "0 0 14px #ff4081" }}>Security Logs</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        <div style={{ maxHeight: 260, overflow: "auto", ...glass("rgba(255,255,255,0.18)") }}>
          {logs.map((l) => (
            <div
              key={l.id}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 90px 1fr",
                gap: 12,
                padding: "8px 12px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ color: "#cfd8dc" }}>{l.time}</div>
              <div style={{ color: levelColor[l.level], fontWeight: 700 }}>{l.level}</div>
              <div>
                <span style={{ opacity: 0.85, marginRight: 8 }}>[{l.source}]</span>
                {l.message}
                {l.meta && (
                  <span style={{ display: "block", opacity: 0.7, fontSize: 12, marginTop: 4 }}>
                    {JSON.stringify(l.meta)}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>

        {/* کنترل‌های لاگ/شبکه */}
        <div style={{ ...glass("rgba(255,64,129,0.25)"), display: "grid", gap: 10 }}>
          <div style={{ fontWeight: 700 }}>Controls</div>
          <button
            onClick={() =>
              pushLog({
                level: "ALERT",
                source: "Network",
                message: "Suspicious outbound traffic detected",
                meta: { dest: "198.51.100.42:443", bytes: Math.floor(Math.random() * 5000) + 1000 },
              })
            }
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              background: "linear-gradient(90deg,#ff4081,#f48fb1)",
              color: "#1a0b13",
              fontWeight: 800,
              border: "none",
              boxShadow: "0 0 16px rgba(255,64,129,0.5)",
              cursor: "pointer",
            }}
          >
            Inject Network Alert
          </button>
          <button
            onClick={() =>
              pushLog({
                level: "INFO",
                source: "System",
                message: "Manual health check executed",
                meta: { uptime: `${Math.floor(Math.random() * 72)}h`, agents: systems.length },
              })
            }
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
            }}
          >
            Health Check
          </button>
          <button
            onClick={() => setLogs([])}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
            }}
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  );
}

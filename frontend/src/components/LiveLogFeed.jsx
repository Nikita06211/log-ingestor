import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function LiveLogFeed() {
  const [logs, setLogs] = useState([]);
  const [levelFilter, setLevelFilter] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [levelFilter, resourceFilter]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/logs", {
        params: {
          level: levelFilter || undefined,
          resourceId: resourceFilter || undefined,
        },
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs: ", err);
    }
  };

  useEffect(() => {
    socket.on("new_log", (log) => {
      const matchLevel = !levelFilter || log.level === levelFilter;
      const matchResource = !resourceFilter || log.resourceId === resourceFilter;
      if (matchLevel && matchResource) {
        setLogs((prev) => [log, ...prev.slice(0, 99)]);
      }
    });
    return () => socket.off("new_log");
  }, [levelFilter, resourceFilter]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <h2 className="text-xl font-bold">📡 Live Logs</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="">All Levels</option>
            <option value="ERROR">ERROR</option>
            <option value="WARN">WARN</option>
            <option value="INFO">INFO</option>
            <option value="DEBUG">DEBUG</option>
          </select>
          <input
            type="text"
            placeholder="Filter by Resource ID"
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          />
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={log.id || index}
            className={`p-2 mb-1 border-l-4 ${
              log.level === "ERROR"
                ? "border-red-500"
                : log.level === "WARN"
                ? "border-yellow-400"
                : "border-gray-300"
            } bg-gray-50 hover:bg-gray-100 rounded`}
          >
            <div className="text-sm text-gray-800 font-medium">{log.message}</div>
            <div className="text-xs text-gray-500">
              [{log.level}] – {new Date(log.timestamp).toLocaleString()} –{" "}
              {log.resourceId}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

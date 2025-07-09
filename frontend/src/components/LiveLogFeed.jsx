import { useState, useEffect } from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "../utils/axios.js";
import io from "socket.io-client";
import Filters from "./Filters";
import DetailedLogView from "./DetailedLogView";

const socket = io("https://log-ingestor-2nlu.onrender.com");

export default function LiveLogFeed() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedLog, setSelectedLog] = useState(null);

  const {data, refetch, isLoading, isError} = useQuery({
    queryKey: ["logs", filters],
    queryFn: async ()=>{
      const res = await axios.get("/api/logs", {params: filters});
      return res.data;
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    if(data) setLogs(data);
  }, [data]);

  useEffect(()=>{
    refetch();
  }, [filters,refetch]);

  useEffect(() => {
    socket.on("new_log", (log) => {
      const matchesFilter = (field, value) => {
        if (!value) return true;
        if (field === "timestamp") {
          const logTime = new Date(log.timestamp).getTime();
          const start = filters.start ? new Date(filters.start).getTime() : null;
          const end = filters.end ? new Date(filters.end).getTime() : null;
          return (!start || logTime >= start) && (!end || logTime <= end);
        }
        return log[field] === value;
      };

      if (
        matchesFilter("level", filters.level) &&
        matchesFilter("resourceId", filters.resourceId) &&
        matchesFilter("traceId", filters.traceId) &&
        matchesFilter("spanId", filters.spanId) &&
        matchesFilter("commit", filters.commit) &&
        matchesFilter("timestamp", filters.timestamp)
      ) {
        setLogs((prev) => [log, ...prev.slice(0, 99)]);
      }
    });
    return () => socket.off("new_log");
  }, [filters]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <h2 className="text-xl font-bold">📡 Live Logs</h2>
      </div>

      <Filters onFilterChange={setFilters} />

      <div className="max-h-[500px] overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={log.id || index}
            onClick={() => setSelectedLog(log)}
            className={`p-2 mb-1 border-l-4 ${
              log.level === "ERROR"
                ? "border-red-500"
                : log.level === "WARN"
                ? "border-yellow-400"
                : "border-gray-300"
            } bg-gray-50 hover:bg-gray-100 rounded`}
          >
            <div className="text-sm text-gray-800 font-medium">
              {log.message}
            </div>
            <div className="text-xs text-gray-500">
              [{log.level}] – {new Date(log.timestamp).toLocaleString()} –{" "}
              {log.resourceId}
            </div>
          </div>
        ))}
      </div>
      <DetailedLogView log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}

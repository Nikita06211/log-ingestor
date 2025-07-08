import { useEffect, useState } from "react";
import axios from "axios";

export default function LogStats() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/logs/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch log stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const levels = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];

  return (
    <div className="p-4 bg-white rounded-xl shadow-md m-6">
      <h2 className="text-xl font-bold mb-4">📊 Log Level Statistics</h2>
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {levels.map((level) => (
            <div
              key={level}
              className={`p-3 rounded text-white font-semibold text-center ${
                level === "ERROR"
                  ? "bg-red-500"
                  : level === "WARN"
                  ? "bg-yellow-400 text-black"
                  : level === "INFO"
                  ? "bg-blue-500"
                  : level === "DEBUG"
                  ? "bg-gray-500"
                  : "bg-black"
              }`}
            >
              <div>{level}</div>
              <div className="text-2xl">{stats[level] ?? 0}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

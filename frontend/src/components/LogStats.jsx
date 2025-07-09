import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios.js";

export default function LogStats() {

  const {
    data: stats = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["log-stats"],
    queryFn: async()=>{
      const res = await axios.get("/api/logs/stats");
      return res.data;
    }
  });

  const levels = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];

  return (
    <div className="p-4 bg-white rounded-xl shadow-md m-6">
      <h2 className="text-xl font-bold mb-4">📊 Log Level Statistics</h2>
      {isLoading ? (
        <p>Loading stats...</p>
      ) : isError?(
        <p className="text-red-600">Error: {error.message}</p>
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

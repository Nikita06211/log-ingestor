import { useState, useEffect } from "react";
import axios from "../utils/axios.js";
import { getSavedQueries, saveQuery, deleteQuery } from "../utils/storage";
import { useQuery } from "@tanstack/react-query";

export default function SearchLogs() {
  const [query, setQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);

  useEffect(() => {
    setSavedQueries(getSavedQueries());
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  const {
    data: results = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["searchLogs", query],
    queryFn: async () => {
      const res = await axios.get(
        `/api/logs/search?q=${encodeURIComponent(query)}`
      );
      return res.data;
    },
    enabled: false,
  });

  const handleSaveQuery = () => {
    const name = prompt("Enter a name for this query:");
    if (name) {
      saveQuery(name, query);
      setSavedQueries(getSavedQueries());
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    await refetch();

    setSearchHistory((prev) => {
      const updated = [query, ...prev.filter((q) => q !== query)];
      const trimmed = updated.slice(0, 10);
      // 🛠 FIXED: Typo in key "seachHistory" -> should be "searchHistory"
      localStorage.setItem("searchHistory", JSON.stringify(trimmed));
      return trimmed;
    });
  };

  const handleHistoryClick = (q) => {
    setQuery(q);
  };

  const handleClearHistory = () => {
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md mt-6">
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search Logs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleSaveQuery}
          className="px-3 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
        >
          💾
        </button>
      </form>

      {/* Recent Search History */}
      {searchHistory.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent Searches:</h3>
            <button
              onClick={handleClearHistory}
              className="text-xs text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {searchHistory.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleHistoryClick(q)}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Saved Queries */}
      {savedQueries.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Saved Queries:</h3>
          <div className="space-y-2">
            {savedQueries.map((q, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-100 rounded px-3 py-2"
              >
                <div className="flex flex-col text-xs">
                  <span className="font-medium">{q.name}</span>
                  <span className="text-gray-600">{q.query}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setQuery(q.query)}
                    className="text-blue-600 text-xs hover:underline"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => {
                      deleteQuery(q.name);
                      setSavedQueries(getSavedQueries());
                    }}
                    className="text-red-500 text-xs hover:underline"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          {results.map((log) => (
            <div
              key={log.id}
              className={`p-2 border-l-4 ${
                log.level === "ERROR"
                  ? "border-red-500"
                  : log.level === "WARN"
                  ? "border-yellow-500"
                  : "border-gray-300"
              } bg-gray-50 rounded`}
            >
              <p className="text-sm font-medium">{log.message}</p>
              <p className="text-xs text-gray-500">
                [{log.level}] – {new Date(log.timestamp).toLocaleString()} –{" "}
                {log.resourceId}
              </p>
            </div>
          ))}
        </div>
      ) : (
        query && <p>No logs found.</p>
      )}
    </div>
  );
}

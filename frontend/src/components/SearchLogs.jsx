import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchLogs() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const stored = localStorage.getItem("searchHistory");
    if(stored){
        setSearchHistory(JSON.parse(stored));
    }
  },[]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/logs/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);

      setSearchHistory((prev) => {
        const updated = [query, ...prev.filter((q) => q !== query)];
        const trimmed = updated.slice(0, 10);
        localStorage.setItem("searchHistory", JSON.stringify(trimmed)); 
        return trimmed
      });
    } catch (err) {
      console.error("Search failed: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (q) => {
    setQuery(q);
  };

  const handleClearHistory = ()=>{
    localStorage.removeItem("searchHistory");
    setSearchHistory([]);
  }

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
      </form>

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

      {loading ? (
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

import { useState } from "react";

export default function Filters({ onFilterChange }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [traceId, setTraceId] = useState("");
  const [spanId, setSpanId] = useState("");
  const [level, setLevel] = useState("");
  const [resourceId, setResourceId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ start, end, traceId, spanId, level, resourceId });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4"
    >
      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Log Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        >
          <option value="">All Levels</option>
          <option value="ERROR">ERROR</option>
          <option value="WARN">WARN</option>
          <option value="INFO">INFO</option>
          <option value="DEBUG">DEBUG</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Resource ID</label>
        <input
          type="text"
          value={resourceId}
          onChange={(e) => setResourceId(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
          placeholder="server-xxxx"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Start Time</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">End Time</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Trace ID</label>
        <input
          type="text"
          value={traceId}
          onChange={(e) => setTraceId(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
          placeholder="abc-xyz-123"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Span ID</label>
        <input
          type="text"
          value={spanId}
          onChange={(e) => setSpanId(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm"
          placeholder="span-123"
        />
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm w-full"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}


export default function DetailedLogView({ log, onClose }) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-2 text-blue-700">Log Details</h2>

        <div className="space-y-2 text-sm text-gray-800">
          <p><strong>Message:</strong> {log.message}</p>
          <p><strong>Level:</strong> {log.level}</p>
          <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
          <p><strong>Resource ID:</strong> {log.resourceId}</p>
          {log.traceId && <p><strong>Trace ID:</strong> {log.traceId}</p>}
          {log.spanId && <p><strong>Span ID:</strong> {log.spanId}</p>}
          {log.commit && <p><strong>Commit:</strong> {log.commit}</p>}
        </div>
      </div>
    </div>
  );
}

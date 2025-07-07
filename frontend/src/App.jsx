
import LiveLogFeed from "./components/LiveLogFeed";

function App() {
  return (
    <div className="min-h-screen p-10 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Log Ingestor Dashboard</h1>
      <LiveLogFeed />
    </div>
  )
}

export default App

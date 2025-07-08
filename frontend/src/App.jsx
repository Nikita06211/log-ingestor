
import LiveLogFeed from "./components/LiveLogFeed";
import SearchLogs from "./components/SearchLogs";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex justify-center items-start p-10">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Log Ingestor Dashboard</h1>
        <LiveLogFeed />
        <SearchLogs />
      </div>
    </div>
  );
}


export default App

import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function LiveLogFeed(){
    const [logs,setLogs] = useState([]);

    useEffect(()=>{
        const fetchLogs = async()=>{
            try{
                const res = await axios.get("http://localhost:4000/api/logs");
                setLogs(res.data);
            }
            catch(err){
                console.error("Failed to fetch logs: ",err);
                
            }
        };
        fetchLogs();
    },[]);

    useEffect(()=>{
        socket.on("new_log",(log)=>{
            setLogs((prevLogs)=>[log,...prevLogs.slice(0,99)]);
        });
        return ()=>{
            socket.off("new_log");
        };
    },[]);

    return(
        <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-3">📡 Live Logs</h2>
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
    )
    
}
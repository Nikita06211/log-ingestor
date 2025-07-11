import express from "express";
import http from "http";
import {Server} from "socket.io";
import cors from "cors";
import logsRouter from "./routes/logs.js";
import { PORT } from "./config.js";


const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

app.set("io",io);

app.use("/api/logs",logsRouter);

app.get("/",(_,res)=> res.send("Log Ingestir API running"));

server.listen(PORT, ()=>{
    console.log(`Backend running on PORT ${PORT}`);
})

io.on("connection",(socket)=>{
    console.log("Client connected: ", socket.id);
    socket.on("disconnect", ()=> console.log("Client disconnected: ", socket.id));
})
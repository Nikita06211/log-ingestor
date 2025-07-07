import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logsRouter from "./router/logs.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/logs",logsRouter);

app.get("/",(_,res)=> res.send("Log Ingestir API running"));

const PORT = process.env.PORT ||4000;

app.listen(PORT, ()=>{
    console.log(`Backend running on PORT ${PORT}`);
})
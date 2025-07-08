import express from "express";
import { logSchema } from "../validators/logValidator.js";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;


const prisma = new PrismaClient();
const router = express.Router();


router.post("/",async(req,res)=>{
    try{
        const parsed = logSchema.parse(req.body);
        const log = await prisma.log.create({
            data: {
                ...parsed,
                timestamp: new Date(req.body.timestamp),
            },
        });

        const io = req.app.get("io");
        io.emit("new_log ", log);

        res.status(201).json(log);
    }
    catch(err){
        if(err.name === "ZodError"){
            return res.status(400).json({
                error: "Validation error",
                details: err.errors,
            });
        }
        console.error(err);
        res.status(500).json({error:"Failed to ingest log"});
    }
});

router.get("/", async (req, res) => {
  const {
    level,
    resourceId,
    traceId,
    spanId,
    commit,
    start,
    end,
  } = req.query;

  const filters = [];

  if (level) filters.push({ level });
  if (resourceId) filters.push({ resourceId });
  if (traceId) filters.push({ traceId });
  if (spanId) filters.push({ spanId });
  if (commit) filters.push({ commit });
  if (start || end) {
    const timestamp = {};
    if (start) timestamp.gte = new Date(start);
    if (end) timestamp.lte = new Date(end);
    filters.push({ timestamp });
  }

  try {
    const logs = await prisma.log.findMany({
      where: filters.length ? { OR: filters } : {},
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching logs" });
  }
});


router.get("/search", async(req,res)=>{
    const {q} = req.query;
    if(!q || typeof q != "string") return res.status(400).json({error: "Missing query parameter"});
    console.log("Search query:", q);
    try{
        const logs = await prisma.$queryRaw`
            SELECT * FROM "Log"
            WHERE to_tsvector('english',"message") @@ plainto_tsquery('english', ${q})
            ORDER BY "timestamp" DESC
            LIMIT 100;
        `;
        res.json(logs);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "search failed"});
    }
});

router.get("/stats", async(req,res)=>{
    try{
        const levels = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];
        const stats = {};

        for(const level of levels){
            const count = await prisma.log.count({where: {level}});
            stats[level] = count;
        }
        res.json(stats);
    }
    catch(error){
        res.status(500).json({error: "failed to compute stats"});
    }
});


router.get("/:id",async(req,res)=>{
    try{
        const log = await prisma.log.findUnique({
            where: {id: req.params.id},
        });
        if(!log) return res.status(404).json({error:"Log not found"});
        res.json(log);
    }
    catch(err){
        res.status(500).json({error:"Error retrieving log"});
    }
});

export default router;
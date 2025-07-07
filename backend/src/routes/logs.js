import express from "express";
import {PrismaClient} from "@prisma/client";
import { logSchema } from "../validators/logValidator";

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
        io.emit("new log ", log);

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

router.get("/",async(req,res)=>{
    const{
        level,
        resourceId,
        traceId,
        spanId,
        commit,
        start,
        end,
    } = req.query;

    const where = {
        ...(level && {level}),
        ...(resourceId && {resourceId}),
        ...(traceId && {traceId}),
        ...(spanId && {spanId}),
        ...(commit && {commit}),
        ...(start || end? {
            timestamp:{
                ...(start && {gte: new Date(start)}),
                ...(end && {lte: new Date(end)}),
            },
        }:{}),
    };
    try{
        const logs = await prisma.log.findMany({
            where,
            orderBy: {timestamp:"desc"},
            take:100,
        });
        res.json(logs);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Error fetching logs"});
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

router.get("/search", async(req,res)=>{
    const q = req.query.q;
    if(!q) return res.status(400).json({error: "Missing query parameter"});

    try{
        const logs = await prisma.log.findMany({
            where:{
                message:{
                    search:q,
                },
            },
            orderBy: {timestamp: "desc"},
            take: 100,
        });
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

export default router;
import {z} from "zod";

export const logSchema = z.object({
    level: z.enum(["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]),
    message: z.string().min(1),
    resourceId: z.string().min(1),
    timestamp: z.string().refine((val)=>!isNaN(Date.parse(val)),{
        message:"Invalid timestamp format",
    }),
    traceId: z.string().optional(),
    spanId: z.string().optional(),
    commit: z.string().optional(),
    metadata: z
    .object({
      parentResourceId: z.string().optional(),
      service: z.string().optional(),
      environment: z.string().optional(),
    })
    .optional(),
});
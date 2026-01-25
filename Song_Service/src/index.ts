import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";
import { connectRedis, redisClient } from "./config/redis.js";

dotenv.config();
await redisClient.connect();
// connectRedis();
const app=express();

const port= process.env.PORT;

app.use("/api/v1", songRoutes);

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})
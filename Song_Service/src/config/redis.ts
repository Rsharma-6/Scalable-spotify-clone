import redis from "redis";
import dotenv from "dotenv";

dotenv.config();
const redisUrl=process.env.REDIS_URL;
if (!redisUrl) throw new Error("REDIS_URL is not defined");


export const redisClient=redis.createClient({
    url: redisUrl,
});

redisClient.on("connect", ()=>{
    console.log("✅ Redis connected");
})

redisClient.on("error", (err)=>{
    console.error("❌ Redis error:", err);
})

export const connectRedis= async() : Promise<void>=>{
    if(!redisClient.isOpen){
        await redisClient.connect();
    }
}
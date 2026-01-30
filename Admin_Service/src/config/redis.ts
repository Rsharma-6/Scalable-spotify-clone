import dotenv from "dotenv";
import redis from "redis";

const redis_url= process.env.REDIS_URL;

if (!redis_url) throw new Error("REDIS_URL is not defined");


export const redisClient=redis.createClient({
    url: redis_url,
});


redisClient.on("connect", ()=>{
    console.log("✅ Redis connected");
})

redisClient.on("error", (err)=>{
    console.error("❌ Redis error:", err);
})

export const RedisConnect= async ()=>{
    if(!redisClient.isOpen){
        redisClient.connect();
    }
}
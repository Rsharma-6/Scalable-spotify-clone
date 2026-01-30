import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./route.js"
import cloudinary from "cloudinary";
import { RedisConnect } from "./config/redis.js";
import cors from "cors";
dotenv.config();

const app= express();
app.use(express.json());
app.use(cors());
await RedisConnect();

if (
  !process.env.CLOUD_NAME ||
  !process.env.CLOUD_API_KEY ||
  !process.env.CLOUD_API_SECRET
) {
  throw new Error("Cloudinary environment variables are missing");
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

async function initDB(){
    try{
        await sql `
        CREATE TABLE IF NOT EXISTS albums(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`; 
        await sql`
        CREATE TABLE IF NOT EXISTS songs(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255),
          audio VARCHAR(255) NOT NULL,
          album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        console.log("Database initialized successfully ");
    } catch (error) {
        console.log("Error initDb", error);
    }
}

const port=process.env.PORT;

app.use("/api/v1", adminRoutes)

initDB().then(()=>{
    app.listen(port, ()=>{
      console.log(`Server is running on port ${port}`);
    });
});
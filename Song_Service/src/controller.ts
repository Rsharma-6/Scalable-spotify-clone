import { json } from "express";
import { sql } from "./config/db.js";
import { redisClient } from "./config/redis.js";
import { TryCatch } from "./TryCatch.js"

export const getAllAlbums=TryCatch(async(req , res)=>{
    let albums;
    const CACHE_EXPIRY=1800;
    if(redisClient.isOpen){
        albums=await redisClient.get("albums");
    }

    if(albums){
        console.log("cache hit");
        res.json(JSON.parse(albums));
        return;
    }
    else{
        console.log("Cache miss");
        albums=await sql`SELECT * FROM albums`;
    
        if(albums.length==0){
            return res.json("No Album Found");
        }   
        if(redisClient.isReady){
            await redisClient.set("albums", JSON.stringify(albums),{EX : CACHE_EXPIRY});
        }
        return res.json(albums);
    }

})

export const getAllsongs=TryCatch(async(req, res)=>{
    let songs;
    const CACHE_EXPIRY=1800;
    if(redisClient.isOpen){
        songs=await redisClient.get("songs");
    }
    if(songs){
        console.log("cache hit for all songs");
        return res.json(JSON.parse(songs));
    }
    else{
        console.log("cache miss for all songs");
        songs= await sql`SELECT * FROM songs`;
        if(songs.length==0){
            return res.json({
                Message : "No Songs Available"
            })
        }
        if(redisClient.isReady){
            redisClient.set("songs", JSON.stringify(songs), {EX : CACHE_EXPIRY})
        }
        return res.json(songs);
    }
});

export const getAllSongsofAlbum=TryCatch(async(req , res)=>{
    const {id}= req.params;

    let album, songs;
    const CACHE_EXPIRY=1800;
    if(redisClient.isReady){
        const cacheData= await redisClient.get(`album_songs_${id}`);
        if(cacheData){
            console.log("cache hit for the album songs");
            res.json(JSON.parse(cacheData));
            return;
        }
    }
    album= await sql`SELECT * FROM albums WHERE id=${id}`;

    if(album.length==0) return res.status(404).json({
        message : "No Album with this id", }
    )

    songs= await sql`SELECT * FROM songs WHERE album_id=${id}`;
    const response={songs, album : album[0] };
    if(redisClient.isReady){
        await redisClient.set(`album_songs_${id}`, JSON.stringify(response),{
            EX: CACHE_EXPIRY
        });
    }
    console.log("Cache miss for the album songs")
    res.json(response);
});

export const getSingleSong=TryCatch(async(req , res)=>{
    const song=await sql`SELECT * FROM songs WHERE id=${req.params.id}`;

    res.json(song[0]);
})
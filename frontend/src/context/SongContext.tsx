import {createContext, useContext, useEffect, useState} from "react";

const server="http://localhost:900";

export interface Song{
    id: string;
    title: string;
    desciption: string;
    thumbnail : string;
    audio: string;
    album : string;
}

export interface Album{
    id: string;
    title: string;
    desciption: string;
    thumbnail : string;
    audio: string;
}

const SongContext=createContext(undefined);
interface SongProviderProps{
    children: ReactNode
}

export const SongProvider: React.FC<SongProviderProps>=({children})=>{
    const {song,  setsong}= useState<Song[]>();
    return <SongContext.Provider value={{song}}=>{children}</SongContext.Provider>
    return 
}
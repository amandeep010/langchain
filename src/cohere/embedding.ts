import { CohereEmbeddings } from "@langchain/cohere";
import dotenv from 'dotenv'
import { textData } from "../upload/upload";
import { upsert } from "../database/pinecone";
import { indexName } from "..";
dotenv.config()

/* Embed queries */
export const embeddings = new CohereEmbeddings({
    apiKey: process.env.COHERE_API,
    batchSize: 48,
});

export const embedData = async(text:string[]=Object.values(textData)) =>{
    const data=await embeddings.embedDocuments(text)
    upsert(indexName,data)
}

export const embedQuery = async(text:string="topic")=>{
    const data=await embeddings.embedQuery(text)
    return data
}
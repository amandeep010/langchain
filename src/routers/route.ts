import {Router} from "express"
import { fileOrgName, readfile, upload } from "../upload/upload"
import { deleteData, fetchData } from "../database/pinecone";

export const router = Router()

router.post('/upload',upload,(req:any,res:any)=>{
    readfile(fileOrgName,true);
    res.send("uploading file in vetor db")
})

router.delete('/delete',(req,res)=>{
    deleteData()
    res.send('data has been deleted')
})

router.post('/fetch',(req,res)=>{
    fetchData(req.body.query)
    res.send('see console')
})      
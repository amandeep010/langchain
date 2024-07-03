import express from 'express'
import { router } from './routers/route'
import { createindex } from './database/pinecone'
import { readfile } from './upload/upload'

const app=express()

app.use(express.json())

export const indexName = 'aman'

app.use(router)

app.listen(process.env.PORT || 8000,async ()=>{
  await createindex("aman")
  readfile()
  console.log("App running")
})
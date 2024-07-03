import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from 'dotenv'
import { indexName } from "..";
import { embedQuery } from "../cohere/embedding";
import { textData } from "../upload/upload";
import { greetings, response } from "../cohere/cohere";
dotenv.config()


const pc = new Pinecone({
  apiKey:process.env.PINECONE_API as string
});

//creating index
export const createindex = async(indexName:string)=>{
  try{
    const indexs:any=(await pc.listIndexes()).indexes?.map(e=>e.name)
    if(!indexs.includes(indexName)){
      await pc.createIndex({
        name:indexName,
        dimension: 1024,
        metric:'cosine',
        spec:{
          serverless:{
            cloud:"aws",
            region:"us-east-1"
          }
        }
      })
      console.log('index has been created')
    }
    else{
      console.log('index already exist')
    }
  }
  catch(err){
    console.error("some issue : ",err)
  }
}


//upserting data
export const upsert=async (indexName:string,array:any)=>{
  try{
    console.log("upserting started")
    await array.forEach(async(e:any,i:any)=>{
      console.log('iteration ',i,' done')
      await pc.Index(indexName).namespace('pdfData').upsert([
        {
          id:`Array${i}`,
          values:e
        }
      ])
    })
    console.log('upsert success !!')
  }
  catch(err){
    console.log('cannot upsert data')
  }
}


//deleting data
export const deleteData=async (namespace:string="pdfData")=>{
  await pc.Index(indexName).namespace(namespace).deleteAll()
  console.log('data has been deleted')
}



let d1: any=""
export let userOldData :[string]=["only use this dataset for getting additional information."];
//fetch query
export const fetchData = async (query:string)=>{
  if(query.split(" ").length<2){
    if(greetings.includes(query.split(" ").join("").toUpperCase)){

    }
    const data=await response(query)
    console.log(data)
    return data;
  }
  console.log("inside fetch")
  await embedQuery(query)
  .then(async(data)=>{
    await pc.Index(indexName).namespace('pdfData').query({
      topK:2,
      vector:data
    }).then(async(data)=>{
      data.matches.forEach((e,i)=>{
        const d=Number(data.matches[i].id.slice(5,data.matches[i].id.length))
        const arr=Object.values(textData)[d]
        d1+=arr
        console.log(arr[i])
      })
      const dataz=await response(query,d1)
      console.log("cohere data : ",dataz)
      userOldData.push(query)
      userOldData.push(dataz)
      console.log("user data : " ,userOldData)
      d1=""
    })
  })
  .catch(err=>{
    console.log('some error inside pinecone/fetchData function!!',err)
  })
}
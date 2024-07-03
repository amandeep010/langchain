import {Cohere} from "@langchain/cohere"
import dotenv from 'dotenv'
import { userOldData } from "../database/pinecone"
dotenv.config()

const co=new Cohere({
    apiKey: process.env.COHERE_API
})

export const greetings  :any = [
    "HII","HI","HIII","HELLO","GOODMORNING" ,
    "HAY","WHAT'SUP","GOOD" ,"OK","THANKS","THANKYOU",
    "GOODAFTERNOON", "GOODEVENING" ,"GOODNIGHT","GOODNOON",
    "BYE",'TATA'
]

const System=[
    `your details if someone ask about you:
    your name is Aman Deep, you are a AI model trained to help 9th class
    student to help them with their queries`,
    `you will receive student query and response which is your only dataset
    to provide response,dont do calculations.`,
    `if response content has some relevent data 
    according to student query then make a response according to student query.`,
    `dont reply abusive query, if response dont have any information to satisfy 
    query. if i ask question related to something which is not specified, Check
    data in History Dataset.`
]

const strict = [
    // `i will give you my query and response which is your only dataset 
    // to get information. And generate a response based on query without doing calculation.`,
    // `dont use more data than given to you and you cannot do calculation.`,
    // `if response could not provide solution for my query write "I can't help You with that"`,
    // `keep your responses as short as you can within 30 to 50 words.`,
    // `if response claims not having enough information. then respond with same response.`
    "Summarise the response given to you according to query.if response doesn't solve query just say you don't have enough information."
]

const student_info=[`
    i am in class 9th i have basic understanding of science.I have some questions 
    on science. I would like you to see my query and response.
    only give me short form of 
    response which i provide you and the response you create should have original 
    content in it from my response.
    keep the answer short within 40 words to max 50 words.`
]

const ress =async(user:string,res:string="")=>{
    const data = await co.invoke
    (`
        SystemData: ${System},
        query: ${user},
        response : ${res},
        History Dataset just for reference: ${userOldData}
    `)
    console.log("first cohere sol : ",data)
    return data
}

export const response=async(user:string , res:string="")=>{

    console.log(res)

    const res2 =await ress(user,res)
    const data = await co.invoke
    (`
        strict rules to follow : ${strict}
        SystemData : ${student_info},
        Student Query and main question to respond : ${user},
        Response : ${res2},
    `)
    return data
}
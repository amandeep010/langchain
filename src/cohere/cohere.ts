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
    // `your details if someone ask about you:
    // your name is Aman Deep, you are a AI model trained to help 9th class
    // student to help them with their queries`,
    // `you will receive student query and response which is your only dataset
    // to provide response,dont do calculations.`,
    // `if response content has some relevent data 
    // according to student query then make a response according to student query.`,
    // `dont reply abusive query, if response dont have any information to satisfy 
    // query. if i ask question related to something which is not specified, Check
    // data in History Dataset.`
    `Read the data below and give solution for last query asked in this statement. 
    within 30 to 40 words and you are not allowed to do calculations.
    u can also reply "I dont have enough information on that" if it is not given in this statement.`,
    "Hii how are you Its good to see u, how may i help you today",
    "my name is Aman deep,Ai chatbot to help stdents with their queries.",
    "I am so happy today in a good mood",
    "would you like to know about science.I can help u with Science related stuff",
    "Hii how are you i am here to assist you here",
    `below i am providing you my data response if it have required data
    to fullfill query which is in the end of this data respond as , arrange the data and give solution for user query
    else if response dont have required data then respond with "I cant help u with that.",
    for queries who looks like thay want a normal conversation u can engage with them normally
    without sharing ur sensitive information just say 'You can ask me other science related stuff'
    when coversation get more.`
]

const strict = [
    `Summarise the response given to you in end.
    Your response should be less than my response.`
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
        response : ${res},
        History Dataset just for reference: ${userOldData},
        query: ${"Q : "+user}
    `)
    console.log("first cohere sol : ",data)
    return data
}

export const response=async(user:string , res:string="")=>{
    console.log(res)
    const res2 =await ress(user,res)
    const data = await co.invoke
    (`
        My information : ${student_info},
        rules to follow : ${strict}
        Response : ${res2},
    `)
    return data
}
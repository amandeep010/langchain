import multer from 'multer'
import pdf from 'pdf-parse'
import fs from 'fs'
import dotenv from 'dotenv'
import { embedData } from '../cohere/embedding'
dotenv.config()

let fileOrgName :string='class 9 science.pdf'

//uploading file
export const folder_dir=process.env.FOLDER_PATH as string
//creating folder
const makedir=()=>{
    fs.existsSync(folder_dir)==false
    ?fs.mkdir(folder_dir,(err)=>{
      if(!err)
        console.log("folder created!!")
      else{
        console.log('error while creating folder :',err)
      }
    })
    :console.log("folder exist")
    return folder_dir
}

const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,makedir())
  },
  filename(req, file, callback) {
    fileOrgName=file.originalname
    callback(null,fileOrgName)
  },
})

export const upload = multer({storage:storage}).single('file')

//reading the pdf
const textData:{[key:string]:string}={}

export const readfile = async (filename:string =fileOrgName,emb:boolean=false)=>{
  const file_dir:string=folder_dir+"/"+filename;
  const data =fs.readFileSync(file_dir)
  await pdf(data)
  .then((data)=>{
    data.text.replace(/^\n+/g,"").replace(/\s+/g," ")
    const arr = data.text.split(' ')
    const ress=[]
    for(let i = 0;i<arr.length;i+=400){
      ress.push(arr.slice(i,i+500).join(' '))
    }
    ress.forEach((data,id)=>{
        textData[id]=data
    })
  
    console.log('textdata has the data now and file has been read')
    if(emb){
      console.log("now we start embedding!!")
      embedData(Object.values(textData))
    }
  })
  .catch(err=>{
    console.log(err)
  })
}

export {textData, fileOrgName}
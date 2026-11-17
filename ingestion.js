import dotenv from "dotenv";
import { PDFParse } from "pdf-parse";
import fs from "fs/promises";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CohereEmbeddings } from "@langchain/cohere";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config();

const parser = new PDFParse({
  data: await fs.readFile("./Pratap_Bhingare_RAG_Knowledge_Base.pdf"),
});

// Retrival of text from the pdf file

const text = (await parser.getText({ pageJoiner: "" })).text;

const textsplitters = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

// converting into chunks

const chunk = await textsplitters.splitText(text);

// implementing embedding

const embedding = new CohereEmbeddings({
  model: "embed-v5.0-fast",
  apiKey: process.env.COHERE_API_KEY,
});

const vectors = await embedding.embedDocuments(chunk);

// initializing pincone client for vector DB

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const index = pc.Index({
    name:"rag-01",
    host:"https://rag-01-kbmdfpt.svc.aped-4627-b74a.pinecone.io"
});

await index.documents.upsert({
    documents: vectors.map((vector,idx)=>{
        return{
            _id:`chunk-${idx}`,
            embeddings:vector,
            content:chunk[idx]  
        }
    })
})

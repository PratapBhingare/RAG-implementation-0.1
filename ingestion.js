import { PDFParse } from "pdf-parse";
import fs from "fs/promises";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const parser = new PDFParse({
  data: await fs.readFile("./story.pdf"),
});

// Retrival of text from the pdf file

const text = (await parser.getText({ pageJoiner: "" })).text;


const textsplitters = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
}); 

// converting into chunks

const chunk = await textsplitters.splitText(text);

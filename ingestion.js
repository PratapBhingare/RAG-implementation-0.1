import {PDFParse} from "pdf-parse";
import fs from "fs/promises"

const parser =  new PDFParse({
    data: await fs.readFile("./story.pdf")
});


// Retrival of text from the pdf file


const text = await parser.getText();
console.log(text);
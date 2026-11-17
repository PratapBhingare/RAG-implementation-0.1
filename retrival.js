import { ChatCohere, CohereEmbeddings } from "@langchain/cohere";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";

const userInput = "Tell me about Aarav's first internship";

//embedding the user input

const embedding = new CohereEmbeddings({
  model: "embed-v5.0-fast",
  apiKey: process.env.COHERE_API_KEY,
});

const vectors = await embedding.embedQuery(userInput);

// searching in pinecone DB

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const index = pc.Index({
  name: "rag-01",
  host: "https://rag-01-kbmdfpt.svc.aped-4627-b74a.pinecone.io",
});

const result = await index.documents.search({
  topK: 3,
  scoreBy: [
    {
      type: "dense_vector",
      fields: "embeddings",
      values: vectors,
    },
  ],
  includeFields: ["content"],
});


// chat model for user input

const model = new ChatCohere({
  model: "command-a-03-2025",
  apiKey: process.env.COHERE_API_KEY,
});

const messages = [];

messages.push(new HumanMessage(userInput));

messages.push(new ToolMessage({
    content:JSON.stringify(result)
}))

const aiResponse = await model.invoke(messages)

console.log(aiResponse);
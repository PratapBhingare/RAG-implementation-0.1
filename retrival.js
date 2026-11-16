import {ChatCohere,CohereEmbeddings} from "@langchain/cohere"
import "dotenv/config"

const userInput = "Tell me about Aarav's first internship";

//embedding the user input

const embedding = new CohereEmbeddings({
    model:"embed-v5.0-fast",
    apiKey:process.env.COHERE_API_KEY
})

const vectors = await embedding.embedQuery(userInput);


// chat model for user input

const model = new ChatCohere({
    model:"command-a-03-2025",
    apiKey:process.env.COHERE_API_KEY
})


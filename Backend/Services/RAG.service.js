import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Blob } from "buffer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { Groq } from "groq-sdk";

const embeddings = new HuggingFaceTransformersEmbeddings({
  modelName: "sentence-transformers/all-MiniLM-L6-v2",
});

const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
});

export const pineconeIndex = pinecone.index("orion");

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
});

export async function indexPDF(file) {
  // file.buffer is the PDF stored in RAM by multer.memoryStorage()
  const pdfBlob = new Blob([file.buffer], { type: "application/pdf" });

  const loader = new PDFLoader(pdfBlob, {
    splitPages: false, // This will load the entire PDF as a single document byDefault its false and Blob is a wraaper which helps to read file in browser environment
  });
  const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
        separators: ["\n\n", "\n", " ", ""],
    })

    const splitDocs = await textSplitter.splitText(docs[0].pageContent)

    const documents = splitDocs.map((text) => ({ pageContent: text }));

    const response = await vectorStore.addDocuments(documents);

    return response;
}


  // LLM setup
     const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function queryPDF(prompt) {

  const results = await vectorStore.similaritySearch(prompt, 5);

  if (!results || results.length === 0) return null;

  if (results[0].score < 0.70) return null;

  const context = results.map((r) => r.pageContent).join("\n\n");

   const query = `Use the following context to answer the question.\n\nContext: ${context}\n\nQuestion: ${prompt}\n\nAnswer:`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `You are a highly intelligent and creative assistant, but during PDF mode you must base your answers ONLY on the information found in the provided PDF context.

Rules:
1. You may add clarity, creativity, structure, and better wording — BUT every factual statement must come from the PDF context.
2. If the PDF context does not contain the answer or enough information, reply EXACTLY with:
   "Not found in PDF."
3. Never invent facts that are not inside the context.
4. You may reorganize, simplify, summarize, or creatively express the information from the context AS LONG AS it remains fully accurate.
`,
        },
        { role: "user", content: query },
      ],
    });

    const answer = completion.choices[0].message.content.trim();

    if (answer === "Not found in PDF.") return null;

    return answer;

}





/* 
  Every step to make a RAG system:
    1. Load the document (PDF, text, etc.)
    2. Split the document into smaller chunks
    3. Create embeddings for each chunk
    4. Store the embeddings in a vector database
    5. At query time, convert the query into an embedding
    6. Retrieve relevant chunks from the vector database
    7. Use the retrieved chunks to generate a response with a language model
*/

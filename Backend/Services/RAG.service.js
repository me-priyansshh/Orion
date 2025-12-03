import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("../../data/nke-10k-2023.pdf");

const docs = await loader.load();
console.log(docs.length);


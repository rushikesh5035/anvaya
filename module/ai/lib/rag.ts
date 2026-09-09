import { google, type GoogleEmbeddingModelOptions } from "@ai-sdk/google";
import { embed } from "ai";

import { pineconeIndex } from "@/lib/pinecone";

const model = google.embedding("gemini-embedding-001");

export const generateEmbeddings = async (text: string) => {
  const { embedding } = await embed({
    model,
    value: text,
    providerOptions: {
      google: {
        outputDimensionality: 768,
      } satisfies GoogleEmbeddingModelOptions,
    },
  });

  return embedding;
};

export const indexCodebase = async (
  repoId: string,
  files: { path: string; content: string }[]
) => {
  const vectors = [];

  for (const file of files) {
    const content = `File: ${file.path}\n\n${file.content}`;

    const truncatedContent = content.slice(0, 8000); // Truncate to 8000 characters

    try {
      const embeddings = await generateEmbeddings(truncatedContent);

      vectors.push({
        id: `${repoId}-${file.path.replace(/\//g, "_")}`,
        values: embeddings,
        metadata: {
          repoId,
          path: file.path,
          content: truncatedContent,
        },
      });
    } catch (error) {
      console.error(
        `Error generating embeddings for file ${file.path}:`,
        error
      );
    }
  }

  if (vectors.length > 0) {
    const batchSize = 100;

    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);

      // Log the batch being indexed
      console.log(`Indexing batch ${i / batchSize + 1}`);

      // Index the batch in Pinecone
      await pineconeIndex.upsert({ records: batch });
    }
  }

  console.log(
    `Indexing completed for repository ${repoId}. Total files indexed: ${vectors.length}`
  );
};

export const retrieveContext = async (
  query: string,
  repoId: string,
  topK: number = 5
) => {
  const embedding = await generateEmbeddings(query);

  const result = await pineconeIndex.query({
    vector: embedding,
    filter: { repoId },
    topK,
    includeMetadata: true,
  });

  return result.matches
    ?.map((match) => match.metadata?.content as string)
    .filter(Boolean);
};

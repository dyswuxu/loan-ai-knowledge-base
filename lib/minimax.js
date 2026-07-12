/**
 * MiniMax API 调用模块
 */
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_API_URL = process.env.MINIMAX_API_URL || 'https://api.minimaxi.chat/v1/text/chatcompletion_v2';
const MINIMAX_EMBED_URL = process.env.MINIMAX_EMBED_URL || 'https://api.minimaxi.chat/v1/text_embeddings';

/**
 * 调用 MiniMax Chat API
 */
async function chatCompletion(messages, model = 'MiniMax-Text-01', temperature = 0.7) {
  const response = await fetch(MINIMAX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * 调用 MiniMax Embedding API
 */
async function getEmbedding(text, model = 'embo-01') {
  const response = await fetch(MINIMAX_EMBED_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MINIMAX_API_KEY}`
    },
    body: JSON.stringify({
      model,
      texts: [text]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax Embedding API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.embeddings?.[0] || [];
}

/**
 * 计算余弦相似度
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (normA * normB);
}

module.exports = {
  chatCompletion,
  getEmbedding,
  cosineSimilarity
};

/**
 * MiniMax API 调用模块
 */

function getApiKey() {
  const key = process.env.MINIMAX_API_KEY;
  if (!key) {
    throw new Error('MINIMAX_API_KEY environment variable is not set');
  }
  return key;
}

function getApiUrl() {
  return process.env.MINIMAX_API_URL || 'https://api.minimaxi.chat/v1/text/chatcompletion_v2';
}

function getEmbedUrl() {
  return process.env.MINIMAX_EMBED_URL || 'https://api.minimaxi.chat/v1/text_embeddings';
}

/**
 * 调用 MiniMax Chat API
 */
async function chatCompletion(messages, model = 'MiniMax-Text-01', temperature = 0.7) {
  const apiKey = getApiKey();
  const apiUrl = getApiUrl();
  
  console.log('🔍 Calling MiniMax API:', apiUrl);
  console.log('🔍 Model:', model);
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: 4096
      })
    });

    console.log('🔍 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ MiniMax API error:', response.status, errorText);
      throw new Error(`MiniMax API error: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('🔍 Response text length:', responseText.length);
    
    if (!responseText) {
      throw new Error('Empty response from MiniMax API');
    }

    const data = JSON.parse(responseText);
    const content = data.choices?.[0]?.message?.content || '';
    console.log('✅ MiniMax API success, content length:', content.length);
    return content;
  } catch (error) {
    console.error('❌ MiniMax API call failed:', error.message);
    throw error;
  }
}

/**
 * 调用 MiniMax Embedding API
 */
async function getEmbedding(text, model = 'embo-01') {
  const apiKey = getApiKey();
  const apiUrl = getEmbedUrl();
  
  console.log('🔍 Calling MiniMax Embedding API');
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        texts: [text]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ MiniMax Embedding API error:', response.status, errorText);
      throw new Error(`MiniMax Embedding API error: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    
    if (!responseText) {
      throw new Error('Empty response from MiniMax Embedding API');
    }

    const data = JSON.parse(responseText);
    return data.embeddings?.[0] || [];
  } catch (error) {
    console.error('❌ MiniMax Embedding API call failed:', error.message);
    throw error;
  }
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

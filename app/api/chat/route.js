import { NextResponse } from 'next/server';
import { chatCompletion } from '../../../lib/minimax';

/**
 * AI 对话 API - 真实接入 MiniMax 大模型
 */
export async function POST(request) {
  try {
    const { session_id, message, history = [] } = await request.json();
    
    if (!message) {
      return NextResponse.json({ reply: '请输入您的问题' }, { status: 400 });
    }

    console.log('💬 Chat message received:', message.substring(0, 50));

    // 构建提示词，引导AI扮演专业的贷款顾问
    const systemPrompt = `你是一位专业、资深的贷款顾问助手，服务于助贷公司业务人员。

你的职责：
1. 回答关于银行贷款产品的问题（利率、额度、准入条件、担保方式等）
2. 协助分析企业客户情况
3. 提供风控建议
4. 指导业务人员更好地开展助贷业务

回答要求：
- 专业、简洁、有条理
- 使用中文回答
- 如果不确定信息，可以诚实说明并给出建议
- 可以适当反问以获取更多信息，提供更准确的建议
- 结合产品知识库的实际产品信息回答

如果用户询问产品相关信息，可以参考195个银行贷款产品的知识库进行回答。`;

    // 构建消息历史
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    try {
      // 调用真实的 MiniMax API
      const reply = await chatCompletion(messages, 'MiniMax-Text-01', 0.7);
      
      console.log('✅ Chat API success, reply length:', reply.length);
      
      return NextResponse.json({
        reply: reply,
        session_id: session_id
      });
    } catch (apiError) {
      console.error('❌ MiniMax API call failed:', apiError.message);
      
      // 如果API调用失败，返回友好提示
      return NextResponse.json({
        reply: '抱歉，AI服务暂时不可用。请稍后重试，或直接联系技术支持。\n\n您也可以尝试：\n• 查询产品：在左侧菜单「产品知识库」中浏览\n• 快速分析：使用「工作台」的快速分析功能',
        session_id: session_id,
        error: 'AI服务暂时不可用'
      });
    }
  } catch (err) {
    console.error('❌ Chat error:', err);
    return NextResponse.json({ reply: '抱歉，服务暂时不可用。' }, { status: 500 });
  }
}

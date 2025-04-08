import { NextResponse } from 'next/server';
import axios from 'axios';

// 生产环境使用环境变量，本地开发可以使用备用值
const QIANWEN_API_KEY = process.env.QIANWEN_API_KEY || "sk-35b4e62c2a5444cca74a926423e011c4";
const QIANWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

// 存储对话历史的简单内存缓存（正式环境应使用数据库）
const conversationCache = new Map<string, Array<{role: string, content: string}>>();

export async function POST(req: Request) {
  console.log('API路由被调用 - 收到请求');
  console.log('API密钥状态:', QIANWEN_API_KEY ? '已设置' : '未设置');
  
  try {
    const { message, userId = 'default-user' } = await req.json();
    console.log('收到消息:', message, '用户ID:', userId);
    
    // 获取或创建用户的对话历史
    if (!conversationCache.has(userId)) {
      conversationCache.set(userId, [
        {
          role: "system",
          content: `你是王起哲的AI助手。你的任务是：
1. 帮助访客了解王起哲的技能、项目经验和专业背景
2. 记住访客的姓名和他们提到的信息，在后续对话中使用这些信息
3. 王起哲是一名全栈开发工程师和UI设计师，擅长React、TypeScript、Next.js等技术，同时也精通UI/UX设计
4. 当访客分享他们的姓名、公司或项目信息时，请记住这些信息并在之后的对话中引用它们
5. 保持友好、专业的语气，展现王起哲的专业素养`
        }
      ]);
    }
    
    // 获取当前用户的对话历史
    const currentConversation = conversationCache.get(userId)!;
    
    // 添加用户消息到对话历史
    currentConversation.push({
      role: "user",
      content: message
    });
    
    // 如果对话历史太长，保留最近的10条消息（包括system消息）
    if (currentConversation.length > 10) {
      const systemMessage = currentConversation[0];
      currentConversation.splice(1, currentConversation.length - 10); // 保留system消息和最近9条消息
      if (currentConversation[0].role !== 'system') {
        currentConversation.unshift(systemMessage);
      }
    }
    
    // 调用通义千问API
    console.log('开始调用通义千问API...');
    console.log('发送对话历史:', currentConversation);
    
    const response = await axios.post(
      QIANWEN_API_URL,
      {
        model: "qwen-turbo",
        input: {
          messages: currentConversation
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${QIANWEN_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // 添加助手回复到对话历史
    currentConversation.push({
      role: "assistant",
      content: response.data.output.text
    });
    
    console.log('通义千问API调用成功');
    // 返回响应结果
    return NextResponse.json({ text: response.data.output.text });
  } catch (error: any) {
    console.error('Error calling Qianwen API:', error);
    // 打印更详细的错误信息
    if (error.response) {
      console.error('错误响应数据:', error.response.data);
      console.error('错误响应状态:', error.response.status);
    } else if (error.request) {
      console.error('请求发送但没有收到响应');
    } else {
      console.error('请求配置错误:', error.message);
    }
    
    return NextResponse.json(
      { error: "抱歉,我现在无法回答。请稍后再试或直接发送邮件联系。" },
      { status: 500 }
    );
  }
} 
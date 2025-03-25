import axios from 'axios';

const QIANWEN_API_KEY = process.env.NEXT_PUBLIC_QIANWEN_API_KEY;
const QIANWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

export async function chatWithQianwen(message: string) {
  try {
    const response = await axios.post(
      QIANWEN_API_URL,
      {
        model: "qwen-turbo",
        input: {
          messages: [
            {
              role: "system",
              content: "你是王起哲的AI助手,你需要帮助访客了解王起哲。王起哲是一名全栈开发工程师和UI设计师,擅长React、TypeScript、Next.js等技术,同时也精通UI/UX设计。"
            },
            {
              role: "user", 
              content: message
            }
          ]
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${QIANWEN_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.output.text;
  } catch (error) {
    console.error('Error calling Qianwen API:', error);
    return "抱歉,我现在无法回答。请稍后再试或直接发送邮件联系。";
  }
} 
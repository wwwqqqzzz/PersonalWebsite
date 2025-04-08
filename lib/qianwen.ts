import axios from 'axios';

// 根据环境计算API路径前缀
const getApiPrefix = () => {
  // 本地开发环境
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return '';
  }
  // 生产环境使用basePath
  return '/portfolio';
};

// 修改为使用我们自己的API路由
export async function chatWithQianwen(message: string, userId?: string) {
  try {
    // 动态构建API路径
    const apiPath = `${getApiPrefix()}/api/chat`;
    console.log('API路径:', apiPath);
    
    const response = await axios.post(apiPath, { 
      message, 
      userId: userId || localStorage.getItem('userId') || generateUserId() 
    });
    
    // 从我们API的响应中获取文本
    return response.data.text;
  } catch (error) {
    console.error('Error calling Chat API:', error);
    return "抱歉,我现在无法回答。请稍后再试或直接发送邮件联系。";
  }
}

// 生成唯一用户ID并保存在localStorage
function generateUserId() {
  const userId = 'user_' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('userId', userId);
  return userId;
} 
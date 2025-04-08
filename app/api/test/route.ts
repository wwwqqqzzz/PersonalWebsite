import { NextResponse } from 'next/server';

// 简单的测试API路由
export async function GET() {
  console.log('测试API路由被调用');
  return NextResponse.json({ message: '测试API成功' });
}

export async function POST(req: Request) {
  console.log('POST测试API路由被调用');
  try {
    const data = await req.json();
    console.log('收到数据:', data);
    return NextResponse.json({ 
      message: '测试API成功', 
      receivedData: data 
    });
  } catch (error) {
    console.error('解析JSON数据错误:', error);
    return NextResponse.json(
      { error: "无法解析请求数据" },
      { status: 400 }
    );
  }
} 
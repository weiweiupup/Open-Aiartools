import { NextResponse } from 'next/server';
import { testFalConnection } from '@/lib/test-fal-connection';

export async function GET() {
  try {
    const result = await testFalConnection();
    
    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
    
  } catch (error) {
    console.error('Test connection error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '连接测试失败',
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
} 
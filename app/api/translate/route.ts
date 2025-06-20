import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage = 'en' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // 如果文本已经是英文，直接返回
    if (isEnglish(text)) {
      return NextResponse.json({
        success: true,
        originalText: text,
        translatedText: text,
        isTranslated: false
      });
    }

    // 使用DeepSeek-Chat模型进行翻译
    const translatedText = await translateWithDeepSeek(text, targetLanguage);

    return NextResponse.json({
      success: true,
      originalText: text,
      translatedText: translatedText,
      isTranslated: translatedText !== text
    });

  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}

// 简单检测是否为英文
function isEnglish(text: string): boolean {
  // 检查是否主要包含英文字符
  const englishRegex = /^[a-zA-Z0-9\s.,!?'"()-]+$/;
  return englishRegex.test(text.trim());
}

// 使用DeepSeek-Chat模型进行翻译
async function translateWithDeepSeek(text: string, targetLang: string = 'en'): Promise<string> {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.warn('DeepSeek API key not found, returning original text');
      return text;
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given text to ${targetLang === 'en' ? 'English' : targetLang}. Only return the translated text, no explanations or additional content.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error(`DeepSeek API error: ${response.status}`);
      return text;
    }

    const result = await response.json();
    
    if (result.choices && result.choices[0] && result.choices[0].message) {
      const translatedText = result.choices[0].message.content.trim();
      return translatedText || text;
    }

    console.error('Invalid response from DeepSeek API');
    return text;

  } catch (error) {
    console.error('DeepSeek translation error:', error);
    return text;
  }
}
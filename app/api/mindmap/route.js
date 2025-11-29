import { NextResponse } from 'next/server';
import { callLLM } from '@/lib/llm-client';
import { MINDMAP_SYSTEM_PROMPT } from '@/lib/prompts';
import { safeParseJsonWithRepair } from '@/lib/json-repair';

function isValidMindmapNode(node) {
  if (!node || typeof node.text !== 'string') return false;
  if (node.children !== undefined) {
    if (!Array.isArray(node.children)) return false;
    for (const child of node.children) {
      if (!isValidMindmapNode(child)) return false;
    }
  }
  return true;
}

export async function POST(request) {
  try {
    const { config, userInput } = await request.json();
    const accessPassword = request.headers.get('x-access-password');

    let finalConfig = config;
    if (accessPassword) {
      const envPassword = process.env.ACCESS_PASSWORD;
      if (!envPassword) {
        return NextResponse.json(
          { error: '服务器未配置访问密码' },
          { status: 400 }
        );
      }
      if (accessPassword !== envPassword) {
        return NextResponse.json(
          { error: '访问密码错误' },
          { status: 401 }
        );
      }
      finalConfig = {
        type: process.env.SERVER_LLM_TYPE,
        baseUrl: process.env.SERVER_LLM_BASE_URL,
        apiKey: process.env.SERVER_LLM_API_KEY,
        model: process.env.SERVER_LLM_MODEL,
      };
      if (!finalConfig?.type || !finalConfig?.apiKey) {
        return NextResponse.json(
          { error: '服务器LLM配置不完整' },
          { status: 500 }
        );
      }
    } else {
      if (!config || typeof userInput !== 'string') {
        return NextResponse.json(
          { error: 'Missing required parameters: config, userInput(string)' },
          { status: 400 }
        );
      }
    }

    const messages = [
      { role: 'system', content: MINDMAP_SYSTEM_PROMPT },
      { role: 'user', content: userInput },
    ];

    const fullText = await callLLM(finalConfig, messages, null);

    const parsed = safeParseJsonWithRepair(fullText);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: '模型输出解析失败' },
        { status: 422 }
      );
    }

    let value = parsed.value;
    let mindmap = value?.mindmap ?? value;
    if (!mindmap?.root && value?.root) {
      mindmap = { root: value.root };
    }

    if (!mindmap || !mindmap.root || !isValidMindmapNode(mindmap.root)) {
      return NextResponse.json(
        { error: '思维导图结构无效' },
        { status: 422 }
      );
    }

    return NextResponse.json({ mindmap });
  } catch (error) {
    console.error('Error generating mindmap:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate mindmap' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json();
    
    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        { error: 'No transcript provided' },
        { status: 400 }
      );
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    // Convert transcript array to a single string and limit length
    const fullText = transcript
      .map((item: { text: string }) => item.text)
      .join(' ')
      .slice(0, 6000); // Limit text length to avoid token issues

    const client = ModelClient(
      "https://models.github.ai/inference",
      new AzureKeyCredential(GITHUB_TOKEN)
    );

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content: "You are an expert video content analyzer. Your task is to analyze video transcripts and provide clear, structured summaries that highlight key points, insights, and overall themes. Format your response with clear sections and bullet points for readability."
          },
          {
            role: "user",
            content: `Please analyze this video transcript and provide a comprehensive summary including:
            - Main topics and key points discussed
            - Important insights and takeaways
            - Overall tone and style of the content
            - Key conclusions or recommendations
            
            Transcript: ${fullText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        model: "meta/Meta-Llama-3-70B-Instruct"
      }
    });

    if (isUnexpected(response)) {
      console.error('API Error:', response.body);
      throw new Error('Failed to analyze transcript');
    }

    return NextResponse.json({
      analysis: response.body.choices[0].message.content
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze transcript' },
      { status: 500 }
    );
  }
} 
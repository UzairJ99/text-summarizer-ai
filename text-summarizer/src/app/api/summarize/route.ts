import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import redisClient from "../../../../lib/redis";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const cacheKey = `summary: ${text}`;
  const openai = new OpenAI();

  try {
    // check cache
    const cachedSummary = await redisClient.get(cacheKey);
    if (cachedSummary) {
      return NextResponse.json({ summar: cachedSummary, cached: true });
    }

    // fetch response from OpenAI model
    const response = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "you are an expert at summarizing large texts into meaningful brief summaries."
          },
          {
            role: "user",
            content: `Summarize the following text: \n ${text}`,
          },
        ],
      }
    );

    const summary = String(response.choices[0].message);

    // store the summary in the redis cache and set the expiry to 6 hours
    // 6 X 6 X 6
    await redisClient.set(cacheKey, summary, { EX: 21600 });

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json(
      { error: `Error generating summary: \n\n ${error}` },
      { status: 500 }
    );
  }
}

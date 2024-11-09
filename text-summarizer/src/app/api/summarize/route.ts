import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import redisClient from "../../../../lib/redis"

export async function POST(req: NextRequest) {
    const {text} = await req.json()
    const cacheKey = `summary: ${text}`

    try {
        // check cache
        const cachedSummary = await redisClient.get(cacheKey);
        if (cachedSummary) {
            return NextResponse.json({summar: cachedSummary, cached: true})
        }

        // fetch response from OpenAI model
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: "text-davinci-003",
                prompt: `Summarize the following text: \n ${text}`,
                max_tokens: 100,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        )

        const summary = response.data.choices[0].text.trim()

        // store the summary in the redis cache and set the expiry to 6 hours
        // 6 X 6 X 6
        await redisClient.set(cacheKey, summary, {EX: 21600})

        return NextResponse.json({summary})
    } catch (error) {
        return NextResponse.json({error: `Error generating summary: \n\n ${error}`}, {status: 500})
    }
}
import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""

    if (!query) {
        return NextResponse.json([])
    }

    const res = await axios.get(
        `https://finnhub.io/api/v1/search?q=${query}&token=${process.env.FINNHUB_API_KEY}`
    )

    return NextResponse.json(res.data.result) // tableau {symbol, description}
}

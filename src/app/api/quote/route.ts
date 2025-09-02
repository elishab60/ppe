import { NextResponse } from "next/server"
import yahooFinance from "yahoo-finance2"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const symbol = searchParams.get("symbol") || "AAPL"

    try {
        const q = await yahooFinance.quote(symbol)
        return NextResponse.json({
            symbol: q.symbol,
            price: q.regularMarketPrice,
            currency: q.currency,
            shortName: q.shortName,
            longName: q.longName,
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

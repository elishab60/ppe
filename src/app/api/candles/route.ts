import { NextResponse } from "next/server"
import yahooFinance from "yahoo-finance2"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const symbol = searchParams.get("symbol") || "AAPL"
    const days = parseInt(searchParams.get("days") || "365", 10)
    const interval = (searchParams.get("interval") || "1d") as
        | "1m"
        | "5m"
        | "15m"
        | "30m"
        | "60m"
        | "1d"
        | "1wk"
        | "1mo"

    try {
        const now = new Date()
        const past = new Date()
        past.setDate(now.getDate() - days)

        const data = await yahooFinance.chart(symbol, {
            period1: past,
            interval,
        })

        const candles = data.quotes.map((d: any) => ({
            time: Math.floor(new Date(d.date).getTime() / 1000),
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            volume: d.volume,
        }))

        return NextResponse.json(candles)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}

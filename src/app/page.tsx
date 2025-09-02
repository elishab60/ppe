"use client"

import { useState } from "react"
import AssetCard from "@/components/AssetCard"

export default function HomePage() {
    const [symbol, setSymbol] = useState("AAPL")
    const [days, setDays] = useState(365)
    const [interval, setInterval] = useState<
        "1m" | "5m" | "15m" | "30m" | "60m" | "1d" | "1wk" | "1mo"
    >("1d")

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-7xl mx-auto space-y-10">


                <AssetCard
                    symbol={symbol}
                    setSymbol={setSymbol}
                    days={days}
                    interval={interval}
                    setDays={setDays}
                    setInterval={setInterval}
                />
            </div>
        </main>
    )
}

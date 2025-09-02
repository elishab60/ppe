"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import SearchBar from "@/components/SearchBar"
import IntervalSelector from "@/components/IntervalSelector"
import Chart from "@/components/Chart"
import axios from "axios"

interface AssetCardProps {
    symbol: string
    setSymbol: (s: string) => void
    days: number
    interval: "1m" | "5m" | "15m" | "30m" | "60m" | "1d" | "1wk" | "1mo"
    setDays: (d: number) => void
    setInterval: (i: any) => void
}

export default function AssetCard({
                                      symbol,
                                      setSymbol,
                                      days,
                                      interval,
                                      setDays,
                                      setInterval,
                                  }: AssetCardProps) {
    const [price, setPrice] = useState<number | null>(null)
    const [currency, setCurrency] = useState<string>("")
    const [displayName, setDisplayName] = useState<string>("")
    const [crosshairData, setCrosshairData] = useState<any | null>(null)

    const fmt = (n: number | null | undefined, digits = 2) =>
        typeof n === "number" ? n.toFixed(digits) : "—"

    const fmtCompact = (n: number | null | undefined) =>
        typeof n === "number"
            ? new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(n)
            : "—"

    useEffect(() => {
        async function fetchQuote() {
            try {
                const res = await axios.get(`/api/quote?symbol=${symbol}`)
                setPrice(res.data.price)
                setCurrency(res.data.currency)
                setDisplayName(res.data.longName || res.data.shortName || symbol)
            } catch (err) {
                console.error(err)
            }
        }
        fetchQuote()
    }, [symbol])

    return (
        <Card className="bg-slate-900 border border-slate-800 shadow-xl">
            {/* HEADER */}

            <div className="px-4 pb-2">
                <div className="flex items-baseline justify-between">
                    <h2 className="text-lg font-semibold text-slate-100 truncate">
                        {displayName  }
                        <span className="text-emerald-400 font-medium ml-2">
            {price !== null ? `${fmt(  price  )} ${currency}` : "—"}
          </span>
                    </h2>

                    {/* RIGHT: Search */}
                    <div className="w-80">
                        <SearchBar onSelectSymbol={setSymbol} />
                    </div>
                </div>

            </div>

            <div className="flex items-center justify-between px-4 pt-4 pb-2 gap-4">
                {/* LEFT: Sélecteur */}
                <IntervalSelector onChange={(d, i) => { setDays(d); setInterval(i) }} />

                {/* CENTER: Crosshair data */}
                <div className="flex-1 min-w-0 text-center">
                    {crosshairData ? (
                        <div className="text-sm text-slate-300 flex gap-3 justify-center items-center whitespace-nowrap overflow-hidden text-ellipsis">
                            <span className="shrink-0 font-semibold text-emerald-400">{symbol}</span>

                            <span>
                Open: <span className="text-emerald-400">{fmt(crosshairData.open)}</span>
              </span>
                            <span>
                High: <span className="text-emerald-400">{fmt(crosshairData.high)}</span>
              </span>
                            <span>
                Low: <span className="text-red-400">{fmt(crosshairData.low)}</span>
              </span>
                            <span>
                Close: <span className="text-emerald-400">{fmt(crosshairData.close)}</span>
              </span>
                            <span>
                Vol: <span className="text-blue-400">{fmtCompact(crosshairData.volume)}</span>
              </span>
                            {/* Δ% badge */}
                            {typeof crosshairData.open === "number" && typeof crosshairData.close === "number" && (
                                (() => {
                                    const delta = ((crosshairData.close - crosshairData.open) / crosshairData.open) * 100
                                    return (
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                delta >= 0
                                                    ? "bg-emerald-900 text-emerald-400"
                                                    : "bg-red-900 text-red-400"
                                            }`}
                                        >
                      {delta >= 0 ? "+" : ""}
                                            {delta.toFixed(2)}%
                    </span>
                                    )
                                })()
                            )}
                        </div>
                    ) : (
                        <div className="text-sm text-slate-500 truncate">
                            Survolez le graphique pour voir O/H/L/C/Vol
                        </div>
                    )}
                </div>


            </div>



            {/* CHART */}
            <CardContent className="p-0">
                <div className="px-2 pb-4">
                    <Chart
                        symbol={symbol}
                        days={days}
                        interval={interval}
                        onCrosshairMove={setCrosshairData}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

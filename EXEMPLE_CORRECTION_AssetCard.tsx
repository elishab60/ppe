// Exemple de correction pour AssetCard.tsx
// Ce fichier montre comment appliquer le typage strict

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import SearchBar from "@/components/SearchBar"
import IntervalSelector from "@/components/IntervalSelector"
import Chart from "@/components/Chart"
import axios from "axios"
import { QuoteResponse, CrosshairData, TimeInterval } from "@/types/financial"

interface AssetCardProps {
    symbol: string
    setSymbol: (s: string) => void
    days: number
    interval: TimeInterval // ✅ Type strict au lieu de union type
    setDays: (d: number) => void
    setInterval: (i: TimeInterval) => void // ✅ Type strict au lieu d'any
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
    const [crosshairData, setCrosshairData] = useState<CrosshairData | null>(null) // ✅ Type strict
    const [loading, setLoading] = useState<boolean>(false) // ✅ État de chargement
    const [error, setError] = useState<string | null>(null) // ✅ Gestion d'erreur

    const fmt = (n: number | null | undefined, digits = 2): string =>
        typeof n === "number" ? n.toFixed(digits) : "—"

    const fmtCompact = (n: number | null | undefined): string =>
        typeof n === "number"
            ? new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(n)
            : "—"

    useEffect(() => {
        async function fetchQuote() {
            if (!symbol) return
            
            setLoading(true)
            setError(null)
            
            try {
                const res = await axios.get<QuoteResponse>(`/api/quote?symbol=${symbol}`) // ✅ Type de réponse
                const data = res.data
                
                setPrice(data.price)
                setCurrency(data.currency)
                setDisplayName(data.longName || data.shortName || symbol)
            } catch (err) {
                console.error(err)
                setError("Erreur lors du chargement des données") // ✅ Message d'erreur utilisateur
            } finally {
                setLoading(false)
            }
        }
        fetchQuote()
    }, [symbol])

    // ✅ Gestion d'erreur dans l'UI
    if (error) {
        return (
            <Card className="bg-slate-900 border border-red-500 shadow-xl">
                <CardContent className="p-4">
                    <div className="text-red-400 text-center">
                        {error}
                        <button 
                            onClick={() => window.location.reload()} 
                            className="ml-2 text-blue-400 underline"
                        >
                            Réessayer
                        </button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-slate-900 border border-slate-800 shadow-xl">
            {/* HEADER */}
            <div className="px-4 pb-2">
                <div className="flex items-baseline justify-between">
                    <h2 className="text-lg font-semibold text-slate-100 truncate">
                        {displayName}
                        <span className="text-emerald-400 font-medium ml-2">
                            {loading ? (
                                <span className="animate-pulse">Chargement...</span>
                            ) : (
                                price !== null ? `${fmt(price)} ${currency}` : "—"
                            )}
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
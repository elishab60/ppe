"use client"

import { useEffect, useRef } from "react"
import {
    createChart,
    ColorType,
    CandlestickSeries,
    HistogramSeries,
} from "lightweight-charts"
import axios from "axios"

interface ChartProps {
    symbol: string
    days: number
    interval: "1m" | "5m" | "15m" | "30m" | "60m" | "1d" | "1wk" | "1mo"
    onCrosshairMove?: (data: any | null) => void
}

export default function Chart({ symbol, days, interval, onCrosshairMove }: ChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!chartContainerRef.current) return

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 480,
            layout: {
                background: { type: ColorType.Solid, color: "#0f172a" },
                textColor: "#e2e8f0",
            },
            grid: {
                vertLines: { color: "#1e293b" },
                horzLines: { color: "#1e293b" },
            },
            crosshair: {
                mode: 1,
            },
            rightPriceScale: { borderColor: "#334155" },
            timeScale: { borderColor: "#334155" },
        })

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#10b981",
            downColor: "#ef4444",
            wickUpColor: "#10b981",
            wickDownColor: "#ef4444",
            borderVisible: false,
        })

        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: "volume" },
            priceScaleId: "",
            scaleMargins: { top: 0.8, bottom: 0 },
        })

        async function load() {
            try {
                const res = await axios.get(
                    `/api/candles?symbol=${encodeURIComponent(symbol)}&days=${days}&interval=${interval}`
                )
                const candles = res.data
                if (!candles.length) return

                candles.sort((a: any, b: any) => a.time - b.time)

                candleSeries.setData(
                    candles.map((c: any) => ({
                        time: c.time,
                        open: c.open,
                        high: c.high,
                        low: c.low,
                        close: c.close,
                    }))
                )



                chart.timeScale().fitContent()
            } catch (e) {
                console.error(e)
            }
        }

        load()

        chart.subscribeCrosshairMove((param) => {
            if (!param.time) {
                onCrosshairMove?.(null)
                return
            }
            const candle: any = param.seriesData.get(candleSeries)
            const volume: any = param.seriesData.get(volumeSeries)
            if (candle) {
                onCrosshairMove?.({
                    time: new Date((param.time as number) * 1000).toLocaleString(),
                    ...candle,
                    volume: volume?.value,
                })
            }
        })

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth || 600 })
        }
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            chart.remove()
        }
    }, [symbol, days, interval, onCrosshairMove])

    return <div ref={chartContainerRef} className="w-full" />
}

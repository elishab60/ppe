"use client"

import { Button } from "@/components/ui/button"

interface IntervalSelectorProps {
    onChange: (
        days: number,
        interval:
            | "1m"
            | "5m"
            | "15m"
            | "30m"
            | "60m"
            | "1d"
            | "1wk"
            | "1mo"
    ) => void
}

const options = [
    { label: "1D", days: 1, interval: "1m" },
    { label: "1M", days: 30, interval: "5m" },
    { label: "6M", days: 180, interval: "30m" },
    { label: "1Y", days: 365, interval: "1d" },
    { label: "5Y", days: 1825, interval: "1wk" },
    { label: "Max", days: 3650, interval: "1mo" },
]

export default function IntervalSelector({ onChange }: IntervalSelectorProps) {
    return (
        <div className="flex gap-2 flex-wrap justify-center">
            {options.map((opt) => (
                <Button
                    key={opt.label}
                    variant="secondary"
                    size="sm"
                    className="rounded-full bg-slate-800 text-slate-200 hover:bg-emerald-600 hover:text-white transition"
                    onClick={() => onChange(opt.days, opt.interval as any)}
                >
                    {opt.label}
                </Button>
            ))}
        </div>
    )
}

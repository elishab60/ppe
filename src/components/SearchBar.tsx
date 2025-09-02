"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import axios from "axios"

interface SearchBarProps {
    onSelectSymbol: (symbol: string) => void
}

export default function SearchBar({ onSelectSymbol }: SearchBarProps) {
    const [input, setInput] = useState("")
    const [suggestions, setSuggestions] = useState<any[]>([])

    useEffect(() => {
        if (input.length < 2) {
            setSuggestions([])
            return
        }

        const fetchSuggestions = async () => {
            try {
                const res = await axios.get(`/api/search?q=${input}`)
                setSuggestions(res.data.slice(0, 6))
            } catch (err) {
                console.error(err)
            }
        }

        fetchSuggestions()
    }, [input])

    return (
        <div className="relative w-full max-w-lg">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-md">
                <Search className="text-slate-400" size={18} />
                <Input
                    className="bg-transparent border-none focus-visible:ring-0 text-slate-100 placeholder-slate-500 flex-1"
                    placeholder="Rechercher un actif (ex: AAPL, TSLA, BTC-USD)"
                    value={input}
                    onChange={(e) => setInput(e.target.value.toUpperCase())}
                />
                <Button
                    variant="secondary"
                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-100"
                    onClick={() => onSelectSymbol(input)}
                >
                    OK
                </Button>
            </div>

            {suggestions.length > 0 && (
                <ul className="absolute top-12 left-0 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-10 overflow-hidden">
                    {suggestions.map((s, idx) => (
                        <li
                            key={idx}
                            className="px-3 py-2 hover:bg-slate-800 cursor-pointer text-slate-200"
                            onClick={() => {
                                onSelectSymbol(s.symbol)
                                setInput(s.symbol)
                                setSuggestions([])
                            }}
                        >
                            <span className="font-semibold text-emerald-400">{s.symbol}</span>{" "}
                            <span className="text-slate-400">{s.description}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

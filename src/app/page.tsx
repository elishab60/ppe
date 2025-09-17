"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const distribution = [
    { asset: "Technologie", weight: 42 },
    { asset: "Énergie", weight: 18 },
    { asset: "Santé", weight: 16 },
    { asset: "Immobilier", weight: 14 },
    { asset: "Consommation", weight: 10 },
]

const aiPredictions = [
    {
        title: "Apple (AAPL)",
        horizon: "5 jours",
        insight: "Tendance haussière avec volatilité modérée.",
    },
    {
        title: "TotalEnergies (TTE)",
        horizon: "2 semaines",
        insight: "Consolidation attendue avant une reprise.",
    },
    {
        title: "LVMH (MC)",
        horizon: "1 mois",
        insight: "Probabilité élevée d'un rebond progressif.",
    },
]

const marketAlerts = [
    {
        label: "Europe",
        message: "Indice PMI manufacturier sous les attentes, pression sur le secteur industriel.",
    },
    {
        label: "États-Unis",
        message: "La Fed laisse entrevoir une pause prolongée, hausse des valeurs de croissance.",
    },
    {
        label: "Asie",
        message: "Tensions persistantes sur les exportations chinoises, volatilité accrue.",
    },
]

export default function HomePage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6 sm:px-10">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
                <header className="flex flex-col gap-2">
                    <span className="text-sm font-medium uppercase tracking-[0.32em] text-sky-400">
                        Tableau de bord
                    </span>
                    <h1 className="text-3xl font-semibold sm:text-4xl">
                        Vue d&apos;ensemble de votre portefeuille
                    </h1>
                    <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
                        Surveillez les performances globales, explorez les recommandations de notre IA
                        et restez informé des signaux de marché en un coup d&apos;œil.
                    </p>
                </header>

                <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_60%)]" />
                        <CardHeader className="relative z-10 gap-4">
                            <div>
                                <CardDescription>Valeur totale du portefeuille</CardDescription>
                                <CardTitle className="text-4xl font-semibold text-white">
                                    182 450 €
                                </CardTitle>
                            </div>
                            <div className="grid gap-4 text-sm text-slate-200 md:grid-cols-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">
                                        Croissance 30 jours
                                    </p>
                                    <p className="text-lg font-semibold text-emerald-400">+6,2 %</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">
                                        Rendement annuelisé
                                    </p>
                                    <p className="text-lg font-semibold text-sky-400">12,4 %</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-slate-400">
                                        Ratio Sharpe
                                    </p>
                                    <p className="text-lg font-semibold text-indigo-300">1,48</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10 flex flex-col gap-6 pb-8">
                            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                                <div className="flex h-48 flex-col justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                                    <p className="text-xs uppercase tracking-wide text-slate-400">
                                        Trajectoire 90 jours
                                    </p>
                                    <div className="flex flex-1 items-center justify-center">
                                        <div className="h-32 w-full rounded-md bg-gradient-to-r from-emerald-500/30 via-sky-400/30 to-indigo-500/30 shadow-inner" />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>90 j</span>
                                        <span>45 j</span>
                                        <span>Aujourd&apos;hui</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
                                    <p className="text-xs uppercase tracking-wide text-slate-400">
                                        Répartition sectorielle
                                    </p>
                                    <ul className="space-y-2 text-sm">
                                        {distribution.map((item) => (
                                            <li key={item.asset} className="flex items-center justify-between">
                                                <span>{item.asset}</span>
                                                <span className="text-slate-400">{item.weight} %</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-6">
                        <Card className="h-fit border-slate-800 bg-slate-900/60">
                            <CardHeader>
                                <CardDescription>Prédictions IA</CardDescription>
                                <CardTitle className="text-xl">Opportunités identifiées</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {aiPredictions.map((item) => (
                                    <div
                                        key={item.title}
                                        className="rounded-lg border border-slate-800 bg-slate-950/60 p-4"
                                    >
                                        <p className="text-sm font-medium text-slate-100">{item.title}</p>
                                        <p className="text-xs uppercase tracking-wide text-slate-500">
                                            Horizon {item.horizon}
                                        </p>
                                        <p className="mt-2 text-sm text-slate-300">{item.insight}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-slate-800 bg-slate-900/60">
                            <CardHeader>
                                <CardDescription>Alertes de marché</CardDescription>
                                <CardTitle className="text-xl">Signaux prioritaires</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {marketAlerts.map((alert) => (
                                    <div key={alert.label} className="flex items-start gap-4">
                                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-300">
                                            {alert.label}
                                        </span>
                                        <p className="text-sm text-slate-300">{alert.message}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Card className="border-slate-800 bg-slate-900/60">
                        <CardHeader className="gap-1">
                            <CardDescription>PNL du jour</CardDescription>
                            <CardTitle className="text-2xl text-emerald-400">+1 820 €</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-400">
                                Porté par les valeurs technologiques (+3,1 %) et la réduction des positions
                                défensives.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/60">
                        <CardHeader className="gap-1">
                            <CardDescription>Positions actives</CardDescription>
                            <CardTitle className="text-2xl">12</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-400">
                                8 positions longues, 4 couvertures. Risque global équilibré avec une
                                exposition nette de 58 %.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/60">
                        <CardHeader className="gap-1">
                            <CardDescription>Indice de confiance IA</CardDescription>
                            <CardTitle className="text-2xl text-sky-400">82 / 100</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-400">
                                Les signaux sont alignés avec les tendances de momentum et les facteurs
                                macroéconomiques.
                            </p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </main>
    )
}

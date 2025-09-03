// Exemple de correction pour /api/quote/route.ts
// Ce fichier montre comment appliquer le typage strict et améliorer la sécurité

import { NextResponse } from "next/server"
import yahooFinance from "yahoo-finance2"
import { QuoteResponse, YahooQuoteData } from "@/types/financial"

// ✅ Interface pour les erreurs
interface ApiError {
    error: string;
    code?: string;
    status: number;
}

// ✅ Fonction utilitaire pour créer des réponses d'erreur
function createErrorResponse(message: string, status: number = 500): NextResponse<ApiError> {
    return NextResponse.json(
        { error: message, status },
        { status }
    )
}

// ✅ Validation du symbole
function validateSymbol(symbol: string | null): string | null {
    if (!symbol) return "Symbole manquant"
    if (symbol.length < 1 || symbol.length > 10) return "Symbole invalide"
    if (!/^[A-Z0-9.-]+$/i.test(symbol)) return "Format de symbole invalide"
    return null
}

export async function GET(req: Request): Promise<NextResponse<QuoteResponse | ApiError>> {
    try {
        const { searchParams } = new URL(req.url)
        const symbol = searchParams.get("symbol")?.toUpperCase() || "AAPL"
        
        // ✅ Validation des paramètres
        const validationError = validateSymbol(symbol)
        if (validationError) {
            return createErrorResponse(validationError, 400)
        }

        // ✅ Gestion des timeouts et retry
        const timeout = 10000 // 10 secondes
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        let quote: YahooQuoteData
        
        try {
            quote = await yahooFinance.quote(symbol, {
                // ✅ Configuration de timeout et retry
                timeout,
                // Note: yahooFinance ne supporte pas directement AbortController
                // mais on peut l'implémenter via Promise.race si nécessaire
            }) as YahooQuoteData
        } catch (error) {
            clearTimeout(timeoutId)
            
            // ✅ Gestion spécifique des erreurs Yahoo Finance
            if (error instanceof Error) {
                if (error.message.includes('404')) {
                    return createErrorResponse(`Symbole '${symbol}' non trouvé`, 404)
                }
                if (error.message.includes('timeout')) {
                    return createErrorResponse("Timeout lors de la récupération des données", 408)
                }
                if (error.message.includes('rate limit')) {
                    return createErrorResponse("Trop de requêtes, veuillez réessayer plus tard", 429)
                }
            }
            
            console.error("Erreur Yahoo Finance:", error)
            return createErrorResponse("Erreur lors de la récupération des données", 500)
        }

        clearTimeout(timeoutId)

        // ✅ Validation des données reçues
        if (!quote || typeof quote.regularMarketPrice !== 'number') {
            return createErrorResponse("Données invalides reçues de l'API", 502)
        }

        // ✅ Réponse typée
        const response: QuoteResponse = {
            symbol: quote.symbol || symbol,
            price: quote.regularMarketPrice,
            currency: quote.currency || "USD",
            shortName: quote.shortName,
            longName: quote.longName,
        }

        // ✅ Headers de cache pour optimiser les performances
        return NextResponse.json(response, {
            headers: {
                'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
                'Content-Type': 'application/json',
            }
        })

    } catch (error) {
        // ✅ Logging structuré pour le monitoring
        console.error("Erreur inattendue dans /api/quote:", {
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
            url: req.url,
        })

        return createErrorResponse("Erreur interne du serveur", 500)
    }
}

// ✅ Optionnel : Support des autres méthodes HTTP avec des erreurs appropriées
export async function POST(): Promise<NextResponse<ApiError>> {
    return createErrorResponse("Méthode non supportée", 405)
}

export async function PUT(): Promise<NextResponse<ApiError>> {
    return createErrorResponse("Méthode non supportée", 405)
}

export async function DELETE(): Promise<NextResponse<ApiError>> {
    return createErrorResponse("Méthode non supportée", 405)
}
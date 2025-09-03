# Guide des corrections recommandées

## 🔧 Corrections prioritaires à appliquer

### 1. Configuration des variables d'environnement

Créer un fichier `.env.local` :
```bash
# API Keys (à garder secret)
FINNHUB_API_KEY=your_finnhub_api_key_here

# Configuration optionnelle
NEXT_PUBLIC_APP_NAME=PPE
NEXT_PUBLIC_APP_VERSION=0.1.0
```

Ajouter à `.env.example` :
```bash
FINNHUB_API_KEY=
```

### 2. Correction du problème de Google Fonts

Dans `src/app/layout.tsx`, remplacer :
```typescript
// ❌ Problématique (nécessite connexion internet)
import { Geist, Geist_Mono } from "next/font/google";

// ✅ Solution de fallback
import localFont from 'next/font/local'

const geistSans = localFont({
  src: './fonts/GeistVF.woff2',
  variable: '--font-geist-sans',
  fallback: ['system-ui', 'arial']
})
```

Ou utiliser des fonts système :
```typescript
// ✅ Alternative avec fonts système
export const metadata: Metadata = {
  title: "PPE - Personal Portfolio Engine",
  description: "Application de visualisation de données financières",
};

// Dans globals.css
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

### 3. Sécurisation de l'API search

Dans `src/app/api/search/route.ts` :
```typescript
// ✅ Version sécurisée
import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q") || ""

    if (!query || query.length < 2) {
        return NextResponse.json([])
    }

    // ✅ Clé API côté serveur uniquement
    const apiKey = process.env.FINNHUB_API_KEY
    if (!apiKey) {
        console.error("FINNHUB_API_KEY manquante")
        return NextResponse.json({ error: "Configuration manquante" }, { status: 500 })
    }

    try {
        const res = await axios.get(
            `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${apiKey}`,
            { timeout: 5000 } // ✅ Timeout
        )
        
        return NextResponse.json(res.data.result?.slice(0, 6) || [])
    } catch (error) {
        console.error("Erreur API Finnhub:", error)
        return NextResponse.json({ error: "Erreur de recherche" }, { status: 500 })
    }
}
```

### 4. Correction des types TypeScript

Appliquer les types définis dans `src/types/financial.ts` :

#### Dans IntervalSelector.tsx :
```typescript
// ✅ Avant
import { IntervalOption, TimeInterval } from "@/types/financial"

interface IntervalSelectorProps {
    onChange: (days: number, interval: TimeInterval) => void // ✅ Type strict
}

const options: IntervalOption[] = [ // ✅ Type strict
    { label: "1D", days: 1, interval: "1m" },
    // ...
]
```

#### Dans Chart.tsx :
```typescript
// ✅ Import des types
import { CandleData, CrosshairData, TimeInterval } from "@/types/financial"

interface ChartProps {
    symbol: string
    days: number
    interval: TimeInterval // ✅ Type strict
    onCrosshairMove?: (data: CrosshairData | null) => void // ✅ Type strict
}
```

### 5. Amélioration de la gestion d'erreurs

Créer un composant ErrorBoundary :
```typescript
// src/components/ErrorBoundary.tsx
"use client"

import { Component, ReactNode } from "react"

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 bg-red-900 border border-red-700 rounded">
                    <h2>Quelque chose s'est mal passé</h2>
                    <button onClick={() => this.setState({ hasError: false })}>
                        Réessayer
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
```

### 6. Configuration ESLint pour corriger les erreurs

Mettre à jour `eslint.config.mjs` :
```javascript
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error", // ✅ Forcer le typage strict
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "error",
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "EXEMPLE_*.tsx", // ✅ Ignorer les fichiers d'exemple
      "ANALYSE_*.md"
    ],
  },
];
```

### 7. Ajout de tests basiques

Structure de test recommandée :
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Exemple de test (`__tests__/components/SearchBar.test.tsx`) :
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '@/components/SearchBar'

describe('SearchBar', () => {
  it('should render search input', () => {
    const mockOnSelect = jest.fn()
    render(<SearchBar onSelectSymbol={mockOnSelect} />)
    
    expect(screen.getByPlaceholderText(/rechercher un actif/i)).toBeInTheDocument()
  })

  it('should call onSelectSymbol when clicking OK', () => {
    const mockOnSelect = jest.fn()
    render(<SearchBar onSelectSymbol={mockOnSelect} />)
    
    const input = screen.getByPlaceholderText(/rechercher un actif/i)
    fireEvent.change(input, { target: { value: 'AAPL' } })
    fireEvent.click(screen.getByText('OK'))
    
    expect(mockOnSelect).toHaveBeenCalledWith('AAPL')
  })
})
```

## 📝 Checklist de déploiement

### Avant production :
- [ ] Toutes les clés API dans les variables d'environnement
- [ ] Build successful sans erreurs
- [ ] Linting sans erreurs TypeScript
- [ ] Tests passent (si implémentés)
- [ ] Gestion d'erreurs robuste
- [ ] Cache et performance optimisés
- [ ] Monitoring et logging configurés

### Optionnel mais recommandé :
- [ ] Documentation API avec Swagger
- [ ] Tests e2e avec Playwright
- [ ] CI/CD configuré
- [ ] Monitoring avec Sentry
- [ ] Analytics configurées
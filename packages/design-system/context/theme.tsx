"use client";

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { getCookie, setCookie, removeCookie } from '@zero-heads-lab/shared/utils'

export type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>

export const DEFAULT_THEME = 'system'
export const THEME_COOKIE_NAME = 'zero-heads-theme-color'
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  defaultTheme: Theme
  resolvedTheme: ResolvedTheme
  theme: Theme
  setTheme: (theme: Theme) => void
  setSystemTheme: () => void
  resetTheme: () => void
}

const initialState: ThemeProviderState = {
  defaultTheme: DEFAULT_THEME,
  resolvedTheme: 'light',
  theme: DEFAULT_THEME,
  setTheme: () => null,
  resetTheme: () => null,
  setSystemTheme: () => null,
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

const decideTheme = () => {
  // SSR: no window, no cookies
  if (typeof document === 'undefined') {
    return DEFAULT_THEME
  }

  const cookieTheme = getCookie(THEME_COOKIE_NAME)
  if (cookieTheme && ['dark', 'light', 'system'].includes(cookieTheme)) {
    return cookieTheme as Theme
  }

  setCookie(THEME_COOKIE_NAME, DEFAULT_THEME, THEME_COOKIE_MAX_AGE)
  return DEFAULT_THEME
}


export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  ...props
}: ThemeProviderProps) {

  const [theme, _setTheme] = useState<Theme>(() => decideTheme())

  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  const resolvedTheme = useMemo<ResolvedTheme>(() => {
    if (theme === 'system') {
      return getSystemTheme()
    }
    return theme
  }, [theme])


  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
      root.classList.remove('light', 'dark')
      root.classList.add(currentResolvedTheme)
    }

    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        applyTheme(systemTheme)
      }
    }

    applyTheme(resolvedTheme)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, resolvedTheme])


  const setTheme = (theme: Theme) => {
    setCookie(storageKey, theme, THEME_COOKIE_MAX_AGE)
    _setTheme(theme)
  }

  const resetTheme = () => {
    removeCookie(storageKey)
    _setTheme(DEFAULT_THEME)
  }

  const setSystemTheme = () => {
    _setTheme(DEFAULT_THEME)
  }

  const contextValue = {
    defaultTheme,
    resolvedTheme,
    resetTheme,
    theme,
    setTheme,
    setSystemTheme
  }

  return (
    <ThemeContext value={contextValue} {...props}>
      {children}
    </ThemeContext>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

export const InitThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('zero-heads-theme-color='))
      ?.split('=')[1]

    let theme = cookie || 'system'

    if (theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    document.documentElement.classList.add(theme)
  } catch (e) {}
})();
`,
      }}
    />
  )
}

'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { Request, Stock, User, Settings, UserRole } from '@/Types/outlet/index'
import { Language } from '@/lib/outlet/translations'

interface AppState {
  requests: Request[]
  stock: Stock[]
  users: User[]
  settings: Settings
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<any>
}

const defaultSettings: Settings = {
  darkMode: false,
  language: 'en',
  emailNotifications: true
}

interface AppProviderProps {
  children: ReactNode
  initialData: {
    requests: Request[]
    stock: Stock[]
    users: User[]
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children, initialData }: AppProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialData,
    settings: {
      ...defaultSettings,
      language: (typeof window !== 'undefined' && localStorage.getItem('language') as Language) || 'en'
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.settings.darkMode)
    document.documentElement.lang = state.settings.language
    localStorage.setItem('language', state.settings.language)
  }, [state.settings.darkMode, state.settings.language])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

function reducer(state: AppState, action: any) {
  switch (action.type) {
    case 'SET_REQUESTS':
      return { ...state, requests: action.payload }
    case 'SET_STOCK':
      return { ...state, stock: action.payload }
    case 'SET_USERS':
      return { ...state, users: action.payload }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        )
      }
    default:
      return state
  }
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

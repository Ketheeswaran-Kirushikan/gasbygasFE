'use client'

import { useApp } from '@/contexts/outlet/app-context'
import { translate, Language, TranslationKey } from '@/lib/outlet/translations'

export function useTranslation() {
  const { state, dispatch } = useApp()

  const t = (key: TranslationKey) => translate(key, state.settings.language as Language)

  const setLanguage = (language: Language) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { language } })
  }

  return { t, setLanguage }
}


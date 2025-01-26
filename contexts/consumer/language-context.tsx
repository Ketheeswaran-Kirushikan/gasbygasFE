"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '@/lib/consumer/db-service';
import { translations, translate as translateFunc } from '@/lib/consumer/translations';

type Language = 'en' | 'ta' | 'si' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (text: string) => string;
  translateDynamic: (text: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const translate = (text: string): string => {
    return translateFunc(text, language);
  };

  const translateDynamic = (text: string, params?: Record<string, string>): string => {
    let translatedText = translate(text);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        translatedText = translatedText.replace(`{${key}}`, value);
      });
    }
    
    return translatedText;
  };

  const updateLanguage = (lang: Language) => {
    setLanguage(lang);
    document.documentElement.lang = lang;
    // Update user preference in database
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      dbService.updateUser(userId, { language: lang });
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      const user = dbService.users.find(u => u.id === userId);
      if (user && (user.language === 'en' || user.language === 'ta' || user.language === 'si' || user.language === 'zh')) {
        setLanguage(user.language);
        document.documentElement.lang = user.language;
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: updateLanguage, 
      translate,
      translateDynamic
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};


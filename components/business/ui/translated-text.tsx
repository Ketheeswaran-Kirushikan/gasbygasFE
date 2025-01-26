"use client"

import React from 'react';
import { useLanguage } from "@/contexts/language-context"

interface TranslatedTextProps {
  text: string;
  params?: Record<string, string>;
}

export function TranslatedText({ text, params }: TranslatedTextProps) {
  const { translateDynamic } = useLanguage();

  return <>{translateDynamic(text, params)}</>;
}


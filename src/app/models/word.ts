export interface VocabWord {
  word: string;
  type: string;
  translation: string;
  sentence: string;
  options: string[];
}

export interface BlastWord {
  word: string;
  translation: string;
  hint: string;
}

export interface MatchPair {
  en: string;
  id: string;
}
// Tipos para análise de roleta

export type RouletteNumber = number; // 0-36

export type RouletteColor = "red" | "black" | "green";

export type DozenPosition = 1 | 2 | 3; // Primeira (1-12), Segunda (13-24), Terceira (25-36)

export type ColumnPosition = 1 | 2 | 3; // Primeira, Segunda, Terceira coluna

export interface RouletteResult {
  number: RouletteNumber;
  color: RouletteColor;
  dozen: DozenPosition | null; // null para 0
  column: ColumnPosition | null; // null para 0
}

export interface SequencePattern {
  type: "color" | "dozen" | "column";
  values: (RouletteColor | DozenPosition | ColumnPosition)[];
  count: number; // Quantas vezes seguidas apareceu
}

export interface RouletteOpportunity {
  type: "color" | "dozen" | "column";
  betOn: string[]; // O que apostar
  sequenceCount: number; // Quantas vezes seguidas apareceu
  confidence: "ruim" | "bom" | "alavancar";
}

export interface RouletteAnalysis {
  id: string;
  timestamp: number;
  imageUri: string;
  detectedNumbers: RouletteResult[];
  patterns: SequencePattern[];
  opportunities: RouletteOpportunity[];
  overallScore: "ruim" | "bom" | "alavancar";
  recommendation: string;
}

export interface UserStats {
  totalAnalyses: number;
  bonsEncontrados: number;
  alavancasEncontradas: number;
  lastAnalysisDate: number | null;
}

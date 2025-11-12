// Motor de análise de padrões de roleta
import {
  RouletteResult,
  RouletteColor,
  DozenPosition,
  ColumnPosition,
  SequencePattern,
  RouletteOpportunity,
  RouletteAnalysis,
} from "../types/roulette";

// Mapeamento dos números da roleta
const ROULETTE_MAP = {
  red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
};

export const getNumberColor = (num: number): RouletteColor => {
  if (num === 0) return "green";
  if (ROULETTE_MAP.red.includes(num)) return "red";
  return "black";
};

export const getNumberDozen = (num: number): DozenPosition | null => {
  if (num === 0) return null;
  if (num >= 1 && num <= 12) return 1;
  if (num >= 13 && num <= 24) return 2;
  return 3;
};

export const getNumberColumn = (num: number): ColumnPosition | null => {
  if (num === 0) return null;
  if (num % 3 === 1) return 1;
  if (num % 3 === 2) return 2;
  return 3;
};

export const parseRouletteNumber = (num: number): RouletteResult => {
  return {
    number: num,
    color: getNumberColor(num),
    dozen: getNumberDozen(num),
    column: getNumberColumn(num),
  };
};

// Detecta sequências de cores
export const detectColorSequences = (results: RouletteResult[]): SequencePattern[] => {
  const patterns: SequencePattern[] = [];
  let currentColor: RouletteColor | null = null;
  let count = 0;
  let sequence: RouletteColor[] = [];

  for (const result of results) {
    if (result.color === "green") continue; // Ignora o 0

    if (result.color === currentColor) {
      count++;
      sequence.push(result.color);
    } else {
      if (count >= 4) {
        patterns.push({
          type: "color",
          values: [...sequence],
          count,
        });
      }
      currentColor = result.color;
      count = 1;
      sequence = [result.color];
    }
  }

  // Adiciona a última sequência se aplicável
  if (count >= 4) {
    patterns.push({
      type: "color",
      values: [...sequence],
      count,
    });
  }

  return patterns;
};

// Detecta sequências de dúzias
export const detectDozenSequences = (results: RouletteResult[]): SequencePattern[] => {
  const patterns: SequencePattern[] = [];

  // Verifica se há sequência na 1ª e 2ª dúzia
  let count12 = 0;
  let sequence12: DozenPosition[] = [];

  // Verifica se há sequência na 1ª e 3ª dúzia
  let count13 = 0;
  let sequence13: DozenPosition[] = [];

  // Verifica se há sequência na 2ª e 3ª dúzia
  let count23 = 0;
  let sequence23: DozenPosition[] = [];

  for (const result of results) {
    if (result.dozen === null) continue;

    // Padrão 1ª e 2ª
    if (result.dozen === 1 || result.dozen === 2) {
      count12++;
      sequence12.push(result.dozen);
    } else {
      if (count12 >= 4) {
        patterns.push({
          type: "dozen",
          values: [...sequence12],
          count: count12,
        });
      }
      count12 = 0;
      sequence12 = [];
    }

    // Padrão 1ª e 3ª
    if (result.dozen === 1 || result.dozen === 3) {
      count13++;
      sequence13.push(result.dozen);
    } else {
      if (count13 >= 4) {
        patterns.push({
          type: "dozen",
          values: [...sequence13],
          count: count13,
        });
      }
      count13 = 0;
      sequence13 = [];
    }

    // Padrão 2ª e 3ª
    if (result.dozen === 2 || result.dozen === 3) {
      count23++;
      sequence23.push(result.dozen);
    } else {
      if (count23 >= 4) {
        patterns.push({
          type: "dozen",
          values: [...sequence23],
          count: count23,
        });
      }
      count23 = 0;
      sequence23 = [];
    }
  }

  // Adiciona as últimas sequências
  if (count12 >= 4) patterns.push({ type: "dozen", values: [...sequence12], count: count12 });
  if (count13 >= 4) patterns.push({ type: "dozen", values: [...sequence13], count: count13 });
  if (count23 >= 4) patterns.push({ type: "dozen", values: [...sequence23], count: count23 });

  return patterns;
};

// Detecta sequências de colunas
export const detectColumnSequences = (results: RouletteResult[]): SequencePattern[] => {
  const patterns: SequencePattern[] = [];

  // Verifica se há sequência na 1ª e 2ª coluna
  let count12 = 0;
  let sequence12: ColumnPosition[] = [];

  // Verifica se há sequência na 1ª e 3ª coluna
  let count13 = 0;
  let sequence13: ColumnPosition[] = [];

  // Verifica se há sequência na 2ª e 3ª coluna
  let count23 = 0;
  let sequence23: ColumnPosition[] = [];

  for (const result of results) {
    if (result.column === null) continue;

    // Padrão 1ª e 2ª
    if (result.column === 1 || result.column === 2) {
      count12++;
      sequence12.push(result.column);
    } else {
      if (count12 >= 4) {
        patterns.push({
          type: "column",
          values: [...sequence12],
          count: count12,
        });
      }
      count12 = 0;
      sequence12 = [];
    }

    // Padrão 1ª e 3ª
    if (result.column === 1 || result.column === 3) {
      count13++;
      sequence13.push(result.column);
    } else {
      if (count13 >= 4) {
        patterns.push({
          type: "column",
          values: [...sequence13],
          count: count13,
        });
      }
      count13 = 0;
      sequence13 = [];
    }

    // Padrão 2ª e 3ª
    if (result.column === 2 || result.column === 3) {
      count23++;
      sequence23.push(result.column);
    } else {
      if (count23 >= 4) {
        patterns.push({
          type: "column",
          values: [...sequence23],
          count: count23,
        });
      }
      count23 = 0;
      sequence23 = [];
    }
  }

  // Adiciona as últimas sequências
  if (count12 >= 4) patterns.push({ type: "column", values: [...sequence12], count: count12 });
  if (count13 >= 4) patterns.push({ type: "column", values: [...sequence13], count: count13 });
  if (count23 >= 4) patterns.push({ type: "column", values: [...sequence23], count: count23 });

  return patterns;
};

// Converte padrões em oportunidades de aposta
export const generateOpportunities = (patterns: SequencePattern[]): RouletteOpportunity[] => {
  const opportunities: RouletteOpportunity[] = [];

  for (const pattern of patterns) {
    let betOn: string[] = [];
    let confidence: "ruim" | "bom" | "alavancar" = "ruim";

    if (pattern.count >= 6 && pattern.count <= 20) {
      confidence = "alavancar";
    } else if (pattern.count >= 4) {
      confidence = "bom";
    }

    if (pattern.type === "color") {
      const color = pattern.values[pattern.values.length - 1] as RouletteColor;
      betOn = [color === "red" ? "Vermelho" : "Preto"];
    } else if (pattern.type === "dozen") {
      const uniqueDozens = Array.from(new Set(pattern.values as DozenPosition[]));
      betOn = uniqueDozens.map((d) => `${d}ª Dúzia`);
    } else if (pattern.type === "column") {
      const uniqueColumns = Array.from(new Set(pattern.values as ColumnPosition[]));
      betOn = uniqueColumns.map((c) => `${c}ª Coluna`);
    }

    opportunities.push({
      type: pattern.type,
      betOn,
      sequenceCount: pattern.count,
      confidence,
    });
  }

  return opportunities;
};

// Análise completa dos números detectados
export const analyzeRouletteResults = (
  numbers: number[],
  imageUri: string
): RouletteAnalysis => {
  const results = numbers.map(parseRouletteNumber);

  // Detecta todos os padrões
  const colorPatterns = detectColorSequences(results);
  const dozenPatterns = detectDozenSequences(results);
  const columnPatterns = detectColumnSequences(results);

  const allPatterns = [...colorPatterns, ...dozenPatterns, ...columnPatterns];

  // Gera oportunidades
  const opportunities = generateOpportunities(allPatterns);

  // Determina score geral
  let overallScore: "ruim" | "bom" | "alavancar" = "ruim";
  const hasAlavanca = opportunities.some((o) => o.confidence === "alavancar");
  const hasBom = opportunities.some((o) => o.confidence === "bom");

  if (hasAlavanca) {
    overallScore = "alavancar";
  } else if (hasBom) {
    overallScore = "bom";
  }

  // Gera recomendação
  let recommendation = "";
  if (overallScore === "alavancar") {
    recommendation = "Excelente momento! Múltiplas oportunidades de alavancagem detectadas. Entre com confiança!";
  } else if (overallScore === "bom") {
    recommendation = "Bom momento para entrar. Padrões favoráveis detectados.";
  } else {
    recommendation = "Momento fraco. Aguarde por padrões mais fortes (4+ sequências).";
  }

  return {
    id: Date.now().toString(),
    timestamp: Date.now(),
    imageUri,
    detectedNumbers: results,
    patterns: allPatterns,
    opportunities,
    overallScore,
    recommendation,
  };
};

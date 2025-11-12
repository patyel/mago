// Motor de análise de padrões de roleta - VERSÃO ATUALIZADA
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

// Verifica se os últimos N resultados seguem um padrão de cor
const checkRecentColorPattern = (
  results: RouletteResult[],
  lastN: number = 4
): { hasPattern: boolean; color: RouletteColor | null; count: number } => {
  if (results.length < lastN) return { hasPattern: false, color: null, count: 0 };

  const recent = results.slice(-lastN);
  const nonGreenRecent = recent.filter((r) => r.color !== "green");

  if (nonGreenRecent.length < lastN) return { hasPattern: false, color: null, count: 0 };

  const firstColor = nonGreenRecent[0].color;
  const allSameColor = nonGreenRecent.every((r) => r.color === firstColor);

  // Conta quantos no total seguem esse padrão
  let totalCount = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].color === "green") continue;
    if (results[i].color === firstColor) {
      totalCount++;
    } else {
      break;
    }
  }

  return {
    hasPattern: allSameColor,
    color: allSameColor ? firstColor : null,
    count: totalCount,
  };
};

// Verifica se os últimos N resultados seguem um padrão de dúzias
const checkRecentDozenPattern = (
  results: RouletteResult[],
  lastN: number = 4
): Array<{ hasPattern: boolean; dozens: DozenPosition[]; count: number }> => {
  const patterns: Array<{ hasPattern: boolean; dozens: DozenPosition[]; count: number }> = [];

  if (results.length < lastN) return patterns;

  const recent = results.slice(-lastN);
  const nonZeroRecent = recent.filter((r) => r.dozen !== null);

  if (nonZeroRecent.length < lastN) return patterns;

  // Verifica padrões: 1+2, 1+3, 2+3
  const dozenPairs = [
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  for (const pair of dozenPairs) {
    const matchesPattern = nonZeroRecent.every((r) => pair.includes(r.dozen as number));

    if (matchesPattern) {
      // Conta quantos no total seguem esse padrão
      let totalCount = 0;
      for (let i = results.length - 1; i >= 0; i--) {
        if (results[i].dozen === null) continue;
        if (pair.includes(results[i].dozen as number)) {
          totalCount++;
        } else {
          break;
        }
      }

      patterns.push({
        hasPattern: true,
        dozens: pair as DozenPosition[],
        count: totalCount,
      });
    }
  }

  return patterns;
};

// Verifica se os últimos N resultados seguem um padrão de colunas
const checkRecentColumnPattern = (
  results: RouletteResult[],
  lastN: number = 4
): Array<{ hasPattern: boolean; columns: ColumnPosition[]; count: number }> => {
  const patterns: Array<{ hasPattern: boolean; columns: ColumnPosition[]; count: number }> = [];

  if (results.length < lastN) return patterns;

  const recent = results.slice(-lastN);
  const nonZeroRecent = recent.filter((r) => r.column !== null);

  if (nonZeroRecent.length < lastN) return patterns;

  // Verifica padrões: 1+2, 1+3, 2+3
  const columnPairs = [
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  for (const pair of columnPairs) {
    const matchesPattern = nonZeroRecent.every((r) => pair.includes(r.column as number));

    if (matchesPattern) {
      // Conta quantos no total seguem esse padrão
      let totalCount = 0;
      for (let i = results.length - 1; i >= 0; i--) {
        if (results[i].column === null) continue;
        if (pair.includes(results[i].column as number)) {
          totalCount++;
        } else {
          break;
        }
      }

      patterns.push({
        hasPattern: true,
        columns: pair as ColumnPosition[],
        count: totalCount,
      });
    }
  }

  return patterns;
};

// Análise completa dos números detectados - NOVA LÓGICA
export const analyzeRouletteResults = (
  numbers: number[],
  imageUri: string
): RouletteAnalysis => {
  const results = numbers.map(parseRouletteNumber);

  const allPatterns: SequencePattern[] = [];
  const opportunities: RouletteOpportunity[] = [];

  // 1. Verifica padrão de COR nos últimos 4
  const colorPattern = checkRecentColorPattern(results, 4);
  if (colorPattern.hasPattern && colorPattern.color) {
    const colorValues = Array(colorPattern.count).fill(colorPattern.color);
    allPatterns.push({
      type: "color",
      values: colorValues,
      count: colorPattern.count,
    });

    let confidence: "ruim" | "bom" | "alavancar" = "ruim";
    if (colorPattern.count >= 6 && colorPattern.count <= 20) {
      confidence = "alavancar";
    } else if (colorPattern.count >= 4) {
      confidence = "bom";
    }

    opportunities.push({
      type: "color",
      betOn: [colorPattern.color === "red" ? "Vermelho" : "Preto"],
      sequenceCount: colorPattern.count,
      confidence,
    });
  }

  // 2. Verifica padrões de DÚZIAS nos últimos 4
  const dozenPatterns = checkRecentDozenPattern(results, 4);
  for (const pattern of dozenPatterns) {
    if (pattern.hasPattern) {
      allPatterns.push({
        type: "dozen",
        values: pattern.dozens,
        count: pattern.count,
      });

      let confidence: "ruim" | "bom" | "alavancar" = "ruim";
      if (pattern.count >= 6 && pattern.count <= 20) {
        confidence = "alavancar";
      } else if (pattern.count >= 4) {
        confidence = "bom";
      }

      opportunities.push({
        type: "dozen",
        betOn: pattern.dozens.map((d) => `${d}ª Dúzia`),
        sequenceCount: pattern.count,
        confidence,
      });
    }
  }

  // 3. Verifica padrões de COLUNAS nos últimos 4
  const columnPatterns = checkRecentColumnPattern(results, 4);
  for (const pattern of columnPatterns) {
    if (pattern.hasPattern) {
      allPatterns.push({
        type: "column",
        values: pattern.columns,
        count: pattern.count,
      });

      let confidence: "ruim" | "bom" | "alavancar" = "ruim";
      if (pattern.count >= 6 && pattern.count <= 20) {
        confidence = "alavancar";
      } else if (pattern.count >= 4) {
        confidence = "bom";
      }

      opportunities.push({
        type: "column",
        betOn: pattern.columns.map((c) => `${c}ª Coluna`),
        sequenceCount: pattern.count,
        confidence,
      });
    }
  }

  // Determina score geral baseado na MÉDIA dos padrões
  let overallScore: "ruim" | "bom" | "alavancar" = "ruim";
  let recommendation = "";

  if (opportunities.length === 0) {
    // Nenhum padrão encontrado nos últimos 4
    overallScore = "ruim";
    recommendation =
      "Não entre agora! Os últimos 4 resultados não formam nenhum padrão válido. Aguarde pelo menos 4 resultados consecutivos no mesmo padrão.";
  } else {
    // Calcula a média dos counts
    const totalCount = opportunities.reduce((sum, opp) => sum + opp.sequenceCount, 0);
    const avgCount = totalCount / opportunities.length;

    // Conta quantos são "alavancar"
    const alavancaCount = opportunities.filter((o) => o.confidence === "alavancar").length;
    const bomCount = opportunities.filter((o) => o.confidence === "bom").length;

    if (avgCount >= 6 && avgCount <= 20) {
      overallScore = "alavancar";
      recommendation = `Momento EXCELENTE para alavancar! Encontrei ${opportunities.length} padrão(ns) forte(s) com média de ${Math.round(avgCount)} sequências. Os últimos 4 resultados confirmam o padrão!`;
    } else if (avgCount >= 4 || bomCount > 0) {
      overallScore = "bom";
      recommendation = `Bom momento para entrar! Encontrei ${opportunities.length} padrão(ns) com média de ${Math.round(avgCount)} sequências. Os últimos 4 resultados confirmam o padrão.`;
    } else {
      overallScore = "ruim";
      recommendation = `Padrão fraco (média ${Math.round(avgCount)}x). Aguarde mais resultados para formar um padrão mais forte.`;
    }
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

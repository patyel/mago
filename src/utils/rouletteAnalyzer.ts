// Motor de análise de padrões de roleta - SÓ DÚZIAS E COLUNAS
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

// Verifica se os últimos N resultados seguem um padrão de dúzias SEM QUEBRA
const checkRecentDozenPattern = (
  results: RouletteResult[],
  lastN: number = 4
): Array<{ hasPattern: boolean; dozens: DozenPosition[]; count: number; broken: boolean }> => {
  const patterns: Array<{
    hasPattern: boolean;
    dozens: DozenPosition[];
    count: number;
    broken: boolean;
  }> = [];

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
      // Conta quantos no total seguem esse padrão (de trás pra frente)
      let totalCount = 0;
      let broken = false;

      for (let i = results.length - 1; i >= 0; i--) {
        if (results[i].dozen === null) continue; // Ignora zero

        if (pair.includes(results[i].dozen as number)) {
          totalCount++;
        } else {
          // QUEBROU O PADRÃO - encontrou número fora do padrão
          broken = true;
          break;
        }
      }

      // Se quebrou antes de chegar em 4, não é válido
      if (totalCount < 4) {
        broken = true;
      }

      patterns.push({
        hasPattern: matchesPattern && !broken && totalCount >= 4,
        dozens: pair as DozenPosition[],
        count: totalCount,
        broken: broken,
      });
    }
  }

  return patterns;
};

// Verifica se os últimos N resultados seguem um padrão de colunas SEM QUEBRA
const checkRecentColumnPattern = (
  results: RouletteResult[],
  lastN: number = 4
): Array<{ hasPattern: boolean; columns: ColumnPosition[]; count: number; broken: boolean }> => {
  const patterns: Array<{
    hasPattern: boolean;
    columns: ColumnPosition[];
    count: number;
    broken: boolean;
  }> = [];

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
      // Conta quantos no total seguem esse padrão (de trás pra frente)
      let totalCount = 0;
      let broken = false;

      for (let i = results.length - 1; i >= 0; i--) {
        if (results[i].column === null) continue; // Ignora zero

        if (pair.includes(results[i].column as number)) {
          totalCount++;
        } else {
          // QUEBROU O PADRÃO - encontrou número fora do padrão
          broken = true;
          break;
        }
      }

      // Se quebrou antes de chegar em 4, não é válido
      if (totalCount < 4) {
        broken = true;
      }

      patterns.push({
        hasPattern: matchesPattern && !broken && totalCount >= 4,
        columns: pair as ColumnPosition[],
        count: totalCount,
        broken: broken,
      });
    }
  }

  return patterns;
};

// Análise completa dos números detectados - SÓ DÚZIAS E COLUNAS
export const analyzeRouletteResults = (
  numbers: number[],
  imageUri: string
): RouletteAnalysis => {
  const results = numbers.map(parseRouletteNumber);

  const allPatterns: SequencePattern[] = [];
  const opportunities: RouletteOpportunity[] = [];

  // 1. Verifica padrões de DÚZIAS nos últimos 4
  const dozenPatterns = checkRecentDozenPattern(results, 4);
  for (const pattern of dozenPatterns) {
    if (pattern.hasPattern && !pattern.broken) {
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

  // 2. Verifica padrões de COLUNAS nos últimos 4
  const columnPatterns = checkRecentColumnPattern(results, 4);
  for (const pattern of columnPatterns) {
    if (pattern.hasPattern && !pattern.broken) {
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

  // Verifica se algum padrão quebrou
  const brokenDozenPatterns = dozenPatterns.filter((p) => p.broken);
  const brokenColumnPatterns = columnPatterns.filter((p) => p.broken);
  const hasBrokenPatterns = brokenDozenPatterns.length > 0 || brokenColumnPatterns.length > 0;

  // Determina score geral baseado na MÉDIA dos padrões
  let overallScore: "ruim" | "bom" | "alavancar" = "ruim";
  let recommendation = "";

  if (hasBrokenPatterns && opportunities.length === 0) {
    // Padrão quebrou - GAIL (não entre)
    overallScore = "ruim";
    recommendation =
      "⚠️ PADRÃO QUEBROU! O último resultado quebrou a sequência. AGUARDE o padrão voltar a se formar (4+ sequências consecutivas) antes de entrar.";
  } else if (opportunities.length === 0) {
    // Nenhum padrão encontrado nos últimos 4
    overallScore = "ruim";
    recommendation =
      "❌ Sem padrão válido! Os últimos 4 resultados não formam nenhum padrão de dúzias ou colunas. Aguarde pelo menos 4 resultados consecutivos no mesmo padrão.";
  } else {
    // Calcula a média dos counts
    const totalCount = opportunities.reduce((sum, opp) => sum + opp.sequenceCount, 0);
    const avgCount = totalCount / opportunities.length;

    // Conta quantos são "alavancar"
    const alavancaCount = opportunities.filter((o) => o.confidence === "alavancar").length;

    if (avgCount >= 6 && avgCount <= 20) {
      overallScore = "alavancar";
      recommendation = `🚀 ALAVANCAR AGORA! Encontrei ${opportunities.length} padrão(ns) forte(s) com média de ${Math.round(avgCount)} sequências. Padrão ATIVO e sem quebra!`;
    } else if (avgCount >= 4) {
      overallScore = "bom";
      recommendation = `👍 BOM MOMENTO! Encontrei ${opportunities.length} padrão(ns) com média de ${Math.round(avgCount)} sequências. Padrão ativo nos últimos 4 resultados.`;
    } else {
      overallScore = "ruim";
      recommendation = `⚠️ Padrão fraco (média ${Math.round(avgCount)}x). Aguarde mais resultados para formar um padrão mais forte (mínimo 4x).`;
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

// Motor de análise de padrões de roleta - TODOS OS PADRÕES
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

interface AllPatternInfo {
  type: "dozen" | "column";
  positions: string;
  count: number;
  isActive: boolean; // Se está ativo agora (últimos 4)
  justBroke: boolean; // Se acabou de quebrar (último número quebrou)
  countBeforeBreak?: number; // Quantas sequências tinha antes da quebra
}

// Analisa TODOS os padrões de dúzias na foto
const analyzeAllDozenPatterns = (results: RouletteResult[]): AllPatternInfo[] => {
  const allPatterns: AllPatternInfo[] = [];
  const dozenPairs = [
    { pair: [1, 2], name: "1ª + 2ª" },
    { pair: [1, 3], name: "1ª + 3ª" },
    { pair: [2, 3], name: "2ª + 3ª" },
  ];

  for (const { pair, name } of dozenPairs) {
    // Conta sequência do FINAL pra trás (mais recente)
    let countFromEnd = 0;
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i].dozen === null) continue;
      if (pair.includes(results[i].dozen as number)) {
        countFromEnd++;
      } else {
        break;
      }
    }

    // Verifica se os últimos 4 estão no padrão (padrão ativo AGORA)
    const last4NonZero = results
      .slice(-10)
      .filter((r) => r.dozen !== null)
      .slice(-4);
    const isActive =
      last4NonZero.length >= 4 && last4NonZero.every((r) => pair.includes(r.dozen as number));

    // NOVA LÓGICA: Busca o MAIOR padrão consecutivo em toda a sequência
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    for (const result of results) {
      if (result.dozen === null) continue;
      if (pair.includes(result.dozen)) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 0;
      }
    }

    // Se o maior padrão foi >= 4, considera válido
    if (maxConsecutive >= 4) {
      // Verifica se acabou de quebrar
      const allExceptLast = results.slice(0, -1).filter((r) => r.dozen !== null);
      let consecutiveFromEnd = 0;
      for (let i = allExceptLast.length - 1; i >= 0; i--) {
        if (pair.includes(allExceptLast[i].dozen as number)) {
          consecutiveFromEnd++;
        } else {
          break;
        }
      }

      const lastResult = results[results.length - 1];
      const justBroke = consecutiveFromEnd >= 4 && lastResult.dozen !== null && !pair.includes(lastResult.dozen);

      allPatterns.push({
        type: "dozen",
        positions: name,
        count: maxConsecutive, // Usa o MAIOR padrão encontrado
        isActive,
        justBroke,
        countBeforeBreak: justBroke ? consecutiveFromEnd : undefined,
      });
    }
  }

  return allPatterns;
};

// Analisa TODOS os padrões de colunas na foto
const analyzeAllColumnPatterns = (results: RouletteResult[]): AllPatternInfo[] => {
  const allPatterns: AllPatternInfo[] = [];
  const columnPairs = [
    { pair: [1, 2], name: "1ª + 2ª" },
    { pair: [1, 3], name: "1ª + 3ª" },
    { pair: [2, 3], name: "2ª + 3ª" },
  ];

  for (const { pair, name } of columnPairs) {
    // Conta sequência do FINAL pra trás (mais recente)
    let countFromEnd = 0;
    for (let i = results.length - 1; i >= 0; i--) {
      if (results[i].column === null) continue;
      if (pair.includes(results[i].column as number)) {
        countFromEnd++;
      } else {
        break;
      }
    }

    // Verifica se os últimos 4 estão no padrão (padrão ativo AGORA)
    const last4NonZero = results
      .slice(-10)
      .filter((r) => r.column !== null)
      .slice(-4);
    const isActive =
      last4NonZero.length >= 4 && last4NonZero.every((r) => pair.includes(r.column as number));

    // NOVA LÓGICA: Busca o MAIOR padrão consecutivo em toda a sequência
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    for (const result of results) {
      if (result.column === null) continue;
      if (pair.includes(result.column)) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 0;
      }
    }

    // Se o maior padrão foi >= 4, considera válido
    if (maxConsecutive >= 4) {
      // Verifica se acabou de quebrar
      const allExceptLast = results.slice(0, -1).filter((r) => r.column !== null);
      let consecutiveFromEnd = 0;
      for (let i = allExceptLast.length - 1; i >= 0; i--) {
        if (pair.includes(allExceptLast[i].column as number)) {
          consecutiveFromEnd++;
        } else {
          break;
        }
      }

      const lastResult = results[results.length - 1];
      const justBroke = consecutiveFromEnd >= 4 && lastResult.column !== null && !pair.includes(lastResult.column);

      allPatterns.push({
        type: "column",
        positions: name,
        count: maxConsecutive, // Usa o MAIOR padrão encontrado
        isActive,
        justBroke,
        countBeforeBreak: justBroke ? consecutiveFromEnd : undefined,
      });
    }
  }

  return allPatterns;
};

// Análise completa dos números detectados
export const analyzeRouletteResults = (
  numbers: number[],
  imageUri: string
): RouletteAnalysis => {
  const results = numbers.map(parseRouletteNumber);

  console.log("🔍 Analisando números:", numbers);
  console.log("🔍 Primeiro número (antigo):", numbers[0]);
  console.log("🔍 Último número (RECENTE):", numbers[numbers.length - 1]);

  // Analisa TODOS os padrões
  const allDozenPatterns = analyzeAllDozenPatterns(results);
  const allColumnPatterns = analyzeAllColumnPatterns(results);

  console.log("📊 Padrões de Dúzias encontrados:", allDozenPatterns);
  console.log("📊 Padrões de Colunas encontrados:", allColumnPatterns);

  // Verifica se algum padrão acabou de quebrar
  const hasBreak = [...allDozenPatterns, ...allColumnPatterns].some((p) => p.justBroke);
  if (hasBreak) {
    console.log("🔴 ATENÇÃO: Padrão acabou de quebrar!");
  }

  const allPatterns: SequencePattern[] = [];
  const opportunities: RouletteOpportunity[] = [];

  // Processa padrões de DÚZIAS
  for (const pattern of allDozenPatterns) {
    // Só considera entrada se está ATIVO agora (últimos 4 estão no padrão)
    if (pattern.isActive) {
      const [d1, d2] = pattern.positions.split(" + ").map((s) => parseInt(s.replace("ª", "")));

      // Para entradas ativas, usa o count do final (quantos consecutivos até agora)
      const countForActive = pattern.count; // maxConsecutive já foi calculado

      // IMPORTANTE: Recalcula o count correto para padrões ativos
      // Conta do final pra trás quantos estão no padrão
      let activeCount = 0;
      const pair = [d1, d2];
      for (let i = results.length - 1; i >= 0; i--) {
        if (results[i].dozen === null) continue;
        if (pair.includes(results[i].dozen as number)) {
          activeCount++;
        } else {
          break;
        }
      }

      // Só adiciona se tem pelo menos 4 sequências ATIVAS
      if (activeCount >= 4) {
        allPatterns.push({
          type: "dozen",
          values: [d1, d2] as DozenPosition[],
          count: activeCount,
        });

        let confidence: "ruim" | "bom" | "alavancar" = "ruim";
        if (activeCount >= 6 && activeCount <= 20) {
          confidence = "alavancar";
        } else if (activeCount >= 4) {
          confidence = "bom";
        }

        opportunities.push({
          type: "dozen",
          betOn: [`${d1}ª Dúzia`, `${d2}ª Dúzia`],
          sequenceCount: activeCount,
          confidence,
        });
      }
    }
  }

  // Processa padrões de COLUNAS
  for (const pattern of allColumnPatterns) {
    // Só considera entrada se está ATIVO agora (últimos 4 estão no padrão)
    if (pattern.isActive) {
      const [c1, c2] = pattern.positions.split(" + ").map((s) => parseInt(s.replace("ª", "")));

      // IMPORTANTE: Recalcula o count correto para padrões ativos
      // Conta do final pra trás quantos estão no padrão
      let activeCount = 0;
      const pair = [c1, c2];
      for (let i = results.length - 1; i >= 0; i--) {
        if (results[i].column === null) continue;
        if (pair.includes(results[i].column as number)) {
          activeCount++;
        } else {
          break;
        }
      }

      // Só adiciona se tem pelo menos 4 sequências ATIVAS
      if (activeCount >= 4) {
        allPatterns.push({
          type: "column",
          values: [c1, c2] as ColumnPosition[],
          count: activeCount,
        });

        let confidence: "ruim" | "bom" | "alavancar" = "ruim";
        if (activeCount >= 6 && activeCount <= 20) {
          confidence = "alavancar";
        } else if (activeCount >= 4) {
          confidence = "bom";
        }

        opportunities.push({
          type: "column",
          betOn: [`${c1}ª Coluna`, `${c2}ª Coluna`],
          sequenceCount: activeCount,
          confidence,
        });
      }
    }
  }

  // Determina score geral
  let overallScore: "ruim" | "bom" | "alavancar" = "ruim";
  let recommendation = "";

  // Monta relatório de TODOS os padrões
  const allPatternsReport: string[] = [];
  let hasRecentBreak = false;
  const brokenPatterns: Array<{ name: string; countBefore: number }> = [];

  // Adiciona padrões de dúzias
  for (const p of allDozenPatterns) {
    let status = "";
    if (p.justBroke) {
      status = "🔴 QUEBROU AGORA!";
      hasRecentBreak = true;
      brokenPatterns.push({
        name: `Dúzia ${p.positions}`,
        countBefore: p.countBeforeBreak || 0
      });
    } else if (p.isActive && p.count >= 4) {
      status = "✅ ATIVO";
    } else if (p.count < 4) {
      status = "⏳ Fraco";
    } else {
      status = "❌ Quebrou";
    }
    allPatternsReport.push(`Dúzia ${p.positions}: ${p.count}x ${status}`);
  }

  // Adiciona padrões de colunas
  for (const p of allColumnPatterns) {
    let status = "";
    if (p.justBroke) {
      status = "🔴 QUEBROU AGORA!";
      hasRecentBreak = true;
      brokenPatterns.push({
        name: `Coluna ${p.positions}`,
        countBefore: p.countBeforeBreak || 0
      });
    } else if (p.isActive && p.count >= 4) {
      status = "✅ ATIVO";
    } else if (p.count < 4) {
      status = "⏳ Fraco";
    } else {
      status = "❌ Quebrou";
    }
    allPatternsReport.push(`Coluna ${p.positions}: ${p.count}x ${status}`);
  }

  // Se teve quebra recente, mas TEM padrões ativos, mostra ambos!
  if (hasRecentBreak && opportunities.length > 0) {
    // Tem padrões ativos E padrões que quebraram
    const breakDetails = brokenPatterns
      .map((bp) => `${bp.name} (tinha ${bp.countBefore}x sequências)`)
      .join(" e ");

    const totalCount = opportunities.reduce((sum, opp) => sum + opp.sequenceCount, 0);
    const avgCount = totalCount / opportunities.length;

    if (avgCount >= 6 && avgCount <= 20) {
      overallScore = "alavancar";
    } else if (avgCount >= 4) {
      overallScore = "bom";
    }

    recommendation = `🎯 ENTRE AGORA!\n\n✅ PADRÕES ATIVOS:\n${opportunities.map((o) => `${o.betOn.join(" + ")}: ${o.sequenceCount}x`).join("\n")}\n\n⚠️ ATENÇÃO: Outro padrão quebrou:\n${breakDetails}\n\nO último número quebrou esse padrão. Aguarde se ele volta ou entre nos padrões ativos acima.\n\n📊 TODOS OS PADRÕES NA FOTO:\n${allPatternsReport.join("\n")}`;

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageUri,
      detectedNumbers: results,
      patterns: allPatterns,
      opportunities, // Retorna as oportunidades ATIVAS
      overallScore,
      recommendation,
    };
  }

  // Se teve quebra recente E NÃO tem padrões ativos, só mostra a quebra
  if (hasRecentBreak) {
    overallScore = "ruim";

    const breakDetails = brokenPatterns
      .map((bp) => `${bp.name} (tinha ${bp.countBefore}x sequências)`)
      .join(" e ");

    recommendation = `⚠️ PADRÃO ACABOU DE QUEBRAR!\n\n🔴 O PADRÃO QUE ESTAVA ATIVO:\n${breakDetails}\n\nO último número quebrou esse padrão!\n\n⏳ AGUARDE! Espere para ver:\n• Se o padrão antigo volta (${brokenPatterns.map(bp => bp.name).join(" ou ")})\n• Ou se um novo padrão se forma\n\n📊 TODOS OS PADRÕES NA FOTO:\n${allPatternsReport.join("\n")}`;

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageUri,
      detectedNumbers: results,
      patterns: allPatterns,
      opportunities: [],
      overallScore,
      recommendation,
    };
  }

  if (opportunities.length === 0) {
    // Nenhum padrão ATIVO com 4+
    overallScore = "ruim";

    if (allPatternsReport.length > 0) {
      recommendation = `❌ NÃO ENTRE AGORA!\n\nTODOS OS PADRÕES NA FOTO:\n${allPatternsReport.join("\n")}\n\nNenhum padrão está ativo com 4+ sequências nos últimos resultados.`;
    } else {
      recommendation =
        "❌ Sem padrão válido! Os últimos resultados não formam nenhum padrão de dúzias ou colunas.";
    }
  } else {
    // Tem padrões ativos
    const totalCount = opportunities.reduce((sum, opp) => sum + opp.sequenceCount, 0);
    const avgCount = totalCount / opportunities.length;

    if (avgCount >= 6 && avgCount <= 20) {
      overallScore = "alavancar";
      recommendation = `🚀 ALAVANCAR AGORA!\n\nENTRE EM:\n${opportunities.map((o) => `${o.betOn.join(" + ")}: ${o.sequenceCount}x`).join("\n")}\n\n📊 TODOS OS PADRÕES NA FOTO:\n${allPatternsReport.join("\n")}`;
    } else if (avgCount >= 4) {
      overallScore = "bom";
      recommendation = `👍 BOM MOMENTO!\n\nENTRE EM:\n${opportunities.map((o) => `${o.betOn.join(" + ")}: ${o.sequenceCount}x`).join("\n")}\n\n📊 TODOS OS PADRÕES NA FOTO:\n${allPatternsReport.join("\n")}`;
    } else {
      overallScore = "ruim";
      recommendation = `⚠️ Padrão fraco!\n\n📊 TODOS OS PADRÕES NA FOTO:\n${allPatternsReport.join("\n")}`;
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

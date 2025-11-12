// Store para estatísticas avançadas e conquistas
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AnalysisResult {
  id: string;
  date: string;
  imageUri: string;
  score: "alavancar" | "bom" | "ruim";
  wasFollowed?: boolean; // Se o usuário seguiu a entrada
  result?: "win" | "loss"; // Resultado da entrada
  profit?: number; // Lucro/perda da entrada
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Stats {
  totalAnalyses: number;
  followedEntries: number;
  wins: number;
  losses: number;
  totalProfit: number;
  bestLive: "11h" | "15h" | "19h" | "Sozinho" | null;
  currentStreak: number; // dias consecutivos usando o app
  lastUsedDate: string;
}

interface StatsStore {
  analysisHistory: AnalysisResult[];
  achievements: Achievement[];
  stats: Stats;
  userLevel: number;
  xp: number;

  // Actions
  addAnalysis: (analysis: AnalysisResult) => void;
  updateAnalysisResult: (id: string, result: "win" | "loss", profit: number) => void;
  unlockAchievement: (id: string) => void;
  updateStreak: () => void;
  getWinRate: () => number;
  getBestLive: () => string;
  addXP: (amount: number) => void;
}

const initialAchievements: Achievement[] = [
  {
    id: "first_analysis",
    title: "Primeira Análise",
    description: "Faça sua primeira análise com IA",
    icon: "sparkles",
    unlocked: false,
  },
  {
    id: "ten_analyses",
    title: "Aprendiz do Mago",
    description: "Complete 10 análises",
    icon: "school",
    unlocked: false,
  },
  {
    id: "fifty_analyses",
    title: "Mago Experiente",
    description: "Complete 50 análises",
    icon: "trophy",
    unlocked: false,
  },
  {
    id: "hundred_analyses",
    title: "Mestre dos Padrões",
    description: "Complete 100 análises",
    icon: "star",
    unlocked: false,
  },
  {
    id: "first_week",
    title: "Dedicação Mágica",
    description: "Use o app por 7 dias seguidos",
    icon: "calendar",
    unlocked: false,
  },
  {
    id: "profitable_week",
    title: "Semana Lucrativa",
    description: "Lucre 7 dias seguidos",
    icon: "trending-up",
    unlocked: false,
  },
  {
    id: "high_winrate",
    title: "Mago Supremo",
    description: "Alcance 70% de taxa de acerto",
    icon: "rocket",
    unlocked: false,
  },
];

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      analysisHistory: [],
      achievements: initialAchievements,
      stats: {
        totalAnalyses: 0,
        followedEntries: 0,
        wins: 0,
        losses: 0,
        totalProfit: 0,
        bestLive: null,
        currentStreak: 0,
        lastUsedDate: new Date().toISOString().split("T")[0],
      },
      userLevel: 1,
      xp: 0,

      addAnalysis: (analysis) => {
        const state = get();
        const newHistory = [analysis, ...state.analysisHistory].slice(0, 100);
        const newStats = {
          ...state.stats,
          totalAnalyses: state.stats.totalAnalyses + 1,
        };

        set({
          analysisHistory: newHistory,
          stats: newStats,
        });

        // Adiciona XP por análise
        get().addXP(10);

        // Checa conquistas
        if (newStats.totalAnalyses === 1) {
          get().unlockAchievement("first_analysis");
        } else if (newStats.totalAnalyses === 10) {
          get().unlockAchievement("ten_analyses");
        } else if (newStats.totalAnalyses === 50) {
          get().unlockAchievement("fifty_analyses");
        } else if (newStats.totalAnalyses === 100) {
          get().unlockAchievement("hundred_analyses");
        }

        // Atualiza streak
        get().updateStreak();
      },

      updateAnalysisResult: (id, result, profit) => {
        const state = get();
        const updatedHistory = state.analysisHistory.map((a) =>
          a.id === id
            ? { ...a, wasFollowed: true, result, profit }
            : a
        );

        const newStats = {
          ...state.stats,
          followedEntries: state.stats.followedEntries + 1,
          wins: result === "win" ? state.stats.wins + 1 : state.stats.wins,
          losses: result === "loss" ? state.stats.losses + 1 : state.stats.losses,
          totalProfit: state.stats.totalProfit + profit,
        };

        set({
          analysisHistory: updatedHistory,
          stats: newStats,
        });

        // Adiciona XP por registrar resultado
        get().addXP(result === "win" ? 25 : 10);

        // Checa conquista de win rate
        const winRate = get().getWinRate();
        if (winRate >= 70 && newStats.followedEntries >= 10) {
          get().unlockAchievement("high_winrate");
        }
      },

      unlockAchievement: (id) => {
        const state = get();
        const achievement = state.achievements.find((a) => a.id === id);

        if (achievement && !achievement.unlocked) {
          const updatedAchievements = state.achievements.map((a) =>
            a.id === id
              ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
              : a
          );

          set({ achievements: updatedAchievements });

          // Adiciona XP bônus por conquista
          get().addXP(50);
        }
      },

      updateStreak: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];
        const lastUsed = state.stats.lastUsedDate;

        const lastDate = new Date(lastUsed);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let newStreak = state.stats.currentStreak;

        if (diffDays === 0) {
          // Mesmo dia, mantém streak
          newStreak = state.stats.currentStreak;
        } else if (diffDays === 1) {
          // Dia seguido, incrementa
          newStreak = state.stats.currentStreak + 1;
        } else {
          // Quebrou a sequência
          newStreak = 1;
        }

        set({
          stats: {
            ...state.stats,
            currentStreak: newStreak,
            lastUsedDate: today,
          },
        });

        // Checa conquista de 7 dias
        if (newStreak >= 7) {
          get().unlockAchievement("first_week");
        }
      },

      getWinRate: () => {
        const state = get();
        if (state.stats.followedEntries === 0) return 0;
        return (state.stats.wins / state.stats.followedEntries) * 100;
      },

      getBestLive: () => {
        const state = get();
        return state.stats.bestLive || "Não há dados suficientes";
      },

      addXP: (amount) => {
        const state = get();
        const newXP = state.xp + amount;
        const xpPerLevel = 100;
        const newLevel = Math.floor(newXP / xpPerLevel) + 1;

        set({
          xp: newXP,
          userLevel: newLevel,
        });
      },
    }),
    {
      name: "stats-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

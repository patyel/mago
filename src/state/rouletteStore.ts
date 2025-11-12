// Store Zustand para o app de Roleta
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouletteAnalysis, UserStats } from "../types/roulette";

interface RouletteStore {
  // Estado da sessão (não persiste)
  currentAnalysis: RouletteAnalysis | null;
  isAnalyzing: boolean;
  hasCompletedOnboarding: boolean;

  // Histórico e estatísticas (persiste)
  analysisHistory: RouletteAnalysis[];
  userStats: UserStats;

  // Actions
  setCurrentAnalysis: (analysis: RouletteAnalysis | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  addAnalysisToHistory: (analysis: RouletteAnalysis) => void;
  clearHistory: () => void;
  completeOnboarding: () => void;
}

export const useRouletteStore = create<RouletteStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentAnalysis: null,
      isAnalyzing: false,
      hasCompletedOnboarding: false,
      analysisHistory: [],
      userStats: {
        totalAnalyses: 0,
        bonsEncontrados: 0,
        alavancasEncontradas: 0,
        lastAnalysisDate: null,
      },

      // Actions
      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

      addAnalysisToHistory: (analysis) => {
        const currentStats = get().userStats;
        const newStats: UserStats = {
          totalAnalyses: currentStats.totalAnalyses + 1,
          bonsEncontrados:
            currentStats.bonsEncontrados + (analysis.overallScore === "bom" ? 1 : 0),
          alavancasEncontradas:
            currentStats.alavancasEncontradas + (analysis.overallScore === "alavancar" ? 1 : 0),
          lastAnalysisDate: Date.now(),
        };

        set({
          analysisHistory: [analysis, ...get().analysisHistory].slice(0, 50), // Mantém últimas 50
          userStats: newStats,
        });
      },

      clearHistory: () =>
        set({
          analysisHistory: [],
          userStats: {
            totalAnalyses: 0,
            bonsEncontrados: 0,
            alavancasEncontradas: 0,
            lastAnalysisDate: null,
          },
        }),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: "roulette-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Persiste apenas histórico e stats
      partialize: (state) => ({
        analysisHistory: state.analysisHistory,
        userStats: state.userStats,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);

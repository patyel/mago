// Store para gerenciar banca do usuário
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LiveResult {
  time: "11h" | "15h" | "19h" | "Sozinho";
  profit: number;
}

export interface DailyResult {
  date: string; // ISO string
  lives: LiveResult[]; // Array de resultados por live
  totalProfit: number; // soma de todas as lives do dia
  bankrollAfter: number;
}

interface BankrollStore {
  initialBankroll: number;
  currentBankroll: number;
  dailyResults: DailyResult[];

  // Actions
  setInitialBankroll: (amount: number) => void;
  addLiveResult: (time: "11h" | "15h" | "19h" | "Sozinho", profit: number) => void;
  getDailyResults: (days: number) => DailyResult[];
  getTotalProfit: () => number;
}

export const useBankrollStore = create<BankrollStore>()(
  persist(
    (set, get) => ({
      initialBankroll: 0,
      currentBankroll: 0,
      dailyResults: [],

      setInitialBankroll: (amount) => {
        set({
          initialBankroll: amount,
          currentBankroll: amount,
          dailyResults: [],
        });
      },

      addLiveResult: (time, profit) => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];

        // Busca resultado de hoje
        const existingIndex = state.dailyResults.findIndex(
          (r) => r.date.split("T")[0] === today
        );

        if (existingIndex >= 0) {
          // Atualiza resultado de hoje
          const dayResult = { ...state.dailyResults[existingIndex] };

          // Remove live anterior se já existir
          dayResult.lives = dayResult.lives.filter((l) => l.time !== time);

          // Adiciona nova live
          dayResult.lives.push({ time, profit });

          // Recalcula total do dia
          dayResult.totalProfit = dayResult.lives.reduce(
            (sum, live) => sum + live.profit,
            0
          );

          // Recalcula banca
          const previousBankroll =
            existingIndex > 0
              ? state.dailyResults[existingIndex - 1].bankrollAfter
              : state.initialBankroll;

          dayResult.bankrollAfter = previousBankroll + dayResult.totalProfit;

          const updatedResults = [...state.dailyResults];
          updatedResults[existingIndex] = dayResult;

          // Recalcula banca atual
          const newBankroll = dayResult.bankrollAfter;

          set({
            currentBankroll: newBankroll,
            dailyResults: updatedResults,
          });
        } else {
          // Cria novo resultado para hoje
          const totalProfit = profit;
          const previousBankroll =
            state.dailyResults.length > 0
              ? state.dailyResults[state.dailyResults.length - 1].bankrollAfter
              : state.initialBankroll;

          const newBankroll = previousBankroll + totalProfit;

          const newResult: DailyResult = {
            date: new Date().toISOString(),
            lives: [{ time, profit }],
            totalProfit,
            bankrollAfter: newBankroll,
          };

          set({
            currentBankroll: newBankroll,
            dailyResults: [...state.dailyResults, newResult],
          });
        }
      },

      getDailyResults: (days) => {
        const state = get();
        return state.dailyResults.slice(-days);
      },

      getTotalProfit: () => {
        const state = get();
        return state.currentBankroll - state.initialBankroll;
      },
    }),
    {
      name: "bankroll-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

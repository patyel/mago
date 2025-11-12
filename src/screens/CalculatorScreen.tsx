// Calculadora de Lucro e Gestão de Apostas - Versão Didática
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface BettingStrategy {
  entriesNeeded: number;
  profitPerEntry: number;
  firstBet: number;
  secondBet: number;
  totalPerEntry: number;
  description: string;
}

export default function CalculatorScreen() {
  const [dailyGoal, setDailyGoal] = useState("");
  const [bankroll, setBankroll] = useState("");
  const [showResults, setShowResults] = useState(false);

  const calculateStrategies = (): BettingStrategy[] => {
    const goal = parseFloat(dailyGoal);
    const bank = parseFloat(bankroll);

    if (isNaN(goal) || isNaN(bank) || goal <= 0 || bank <= 0) {
      return [];
    }

    const strategies: BettingStrategy[] = [];

    // Pagamento: dúzias e colunas pagam 2:1 (recebe 3x se ganhar)
    // Para lucrar X apostando em 2 dúzias:
    // - Aposta X em cada dúzia (total 2X)
    // - Se ganhar: recebe 3X de uma dúzia
    // - Lucro: 3X - 2X = X

    // Opções: 1, 2, 5, 10 entradas
    const entryOptions = [1, 2, 5, 10];

    entryOptions.forEach((entries) => {
      const profitPerEntry = goal / entries;
      // Para lucrar profitPerEntry, precisa apostar profitPerEntry em cada dúzia
      const betPerDozen = profitPerEntry;
      const totalBet = betPerDozen * 2; // aposta em 2 dúzias

      // Só adiciona se for viável com a banca
      if (totalBet <= bank) {
        strategies.push({
          entriesNeeded: entries,
          profitPerEntry,
          firstBet: betPerDozen,
          secondBet: 0, // não usado mais
          totalPerEntry: totalBet,
          description:
            entries === 1
              ? "Implacável"
              : entries === 2
                ? "Visionário"
                : entries === 5
                  ? "Conservador"
                  : "Muito Conservador",
        });
      }
    });

    return strategies;
  };

  const strategies = showResults ? calculateStrategies() : [];

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="flex-1">
            {/* Header */}
            <View className="px-6 pt-4 pb-6">
              <Text className="text-white text-3xl font-bold mb-2">
                Calculadora de Lucro
              </Text>
              <Text className="text-slate-400">
                Descubra como atingir sua meta diária
              </Text>
            </View>

            {/* Formulário */}
            <View className="px-6 mb-6">
              <View className="bg-slate-800 rounded-3xl p-6 border-2 border-slate-700">
                {/* Meta Diária */}
                <View className="mb-6">
                  <Text className="text-white text-sm font-medium mb-2">
                    Meta de Lucro Diário (R$)
                  </Text>
                  <TextInput
                    className="bg-slate-700 text-white text-2xl px-4 py-4 rounded-xl border-2 border-slate-600"
                    placeholder="100.00"
                    placeholderTextColor="#64748b"
                    keyboardType="decimal-pad"
                    value={dailyGoal}
                    onChangeText={(text) => {
                      setDailyGoal(text);
                      setShowResults(false);
                    }}
                  />
                </View>

                {/* Banca */}
                <View className="mb-6">
                  <Text className="text-white text-sm font-medium mb-2">
                    Banca Disponível (R$)
                  </Text>
                  <TextInput
                    className="bg-slate-700 text-white text-2xl px-4 py-4 rounded-xl border-2 border-slate-600"
                    placeholder="1000.00"
                    placeholderTextColor="#64748b"
                    keyboardType="decimal-pad"
                    value={bankroll}
                    onChangeText={(text) => {
                      setBankroll(text);
                      setShowResults(false);
                    }}
                  />
                </View>

                {/* Botão Calcular */}
                <Pressable
                  onPress={() => setShowResults(true)}
                  className="bg-purple-500 py-4 rounded-xl items-center active:opacity-70"
                  disabled={!dailyGoal || !bankroll}
                >
                  <Text className="text-white text-lg font-bold">
                    Ver Estratégias
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Resultados - Estratégias */}
            {showResults && strategies.length > 0 && (
              <View className="px-6 mb-6">
                <Text className="text-white text-2xl font-bold mb-2">
                  Escolha Sua Estratégia
                </Text>
                <Text className="text-slate-400 mb-4">
                  {strategies.length} formas de atingir R$ {dailyGoal}
                </Text>

                {/* Cards de Estratégias */}
                <View className="space-y-4">
                  {strategies.map((strategy, index) => {
                    const colors = [
                      {
                        bg: "bg-red-500/10",
                        border: "border-red-500",
                        text: "text-red-400",
                        icon: "#ef4444",
                      },
                      {
                        bg: "bg-amber-500/10",
                        border: "border-amber-500",
                        text: "text-amber-400",
                        icon: "#f59e0b",
                      },
                      {
                        bg: "bg-emerald-500/10",
                        border: "border-emerald-500",
                        text: "text-emerald-400",
                        icon: "#10b981",
                      },
                      {
                        bg: "bg-blue-500/10",
                        border: "border-blue-500",
                        text: "text-blue-400",
                        icon: "#3b82f6",
                      },
                    ];

                    const color = colors[index] || colors[0];

                    return (
                      <View
                        key={index}
                        className={`${color.bg} rounded-2xl p-5 border-2 ${color.border}`}
                      >
                        {/* Header da Estratégia */}
                        <View className="flex-row items-center mb-4">
                          <View
                            style={{ backgroundColor: color.icon + "33" }}
                            className="w-12 h-12 rounded-full items-center justify-center mr-3"
                          >
                            <Text className="text-white text-xl font-bold">
                              {strategy.entriesNeeded}x
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-white text-lg font-bold">
                              {strategy.description}
                            </Text>
                            <Text className={`${color.text} text-sm`}>
                              R$ {strategy.profitPerEntry.toFixed(2)} por entrada
                            </Text>
                          </View>
                        </View>

                        {/* Detalhes das Apostas */}
                        <View className="bg-slate-900/50 rounded-xl p-4 mb-3">
                          <View className="flex-row justify-between mb-2">
                            <Text className="text-slate-300 text-sm">
                              Aposta em CADA dúzia/coluna
                            </Text>
                            <Text className="text-white font-bold">
                              R$ {strategy.firstBet.toFixed(2)}
                            </Text>
                          </View>
                          <View className="flex-row justify-between mb-2">
                            <Text className="text-slate-300 text-sm">
                              Total investido (2 dúzias/colunas)
                            </Text>
                            <Text className="text-amber-400 font-bold">
                              R$ {strategy.totalPerEntry.toFixed(2)}
                            </Text>
                          </View>
                          <View className="h-px bg-slate-700 my-2" />
                          <View className="flex-row justify-between">
                            <Text className="text-emerald-400 font-bold">
                              Lucro por Entrada
                            </Text>
                            <Text className={`${color.text} font-bold text-lg`}>
                              R$ {strategy.profitPerEntry.toFixed(2)}
                            </Text>
                          </View>
                        </View>

                        {/* Simulação de Lucro */}
                        <View className="bg-slate-900/50 rounded-xl p-4 mb-3">
                          <Text className="text-slate-400 text-xs mb-3">
                            Como funciona cada entrada:
                          </Text>

                          <View className="space-y-2">
                            <View className="flex-row items-center">
                              <View className="w-6 h-6 bg-blue-500/20 rounded-full items-center justify-center mr-2">
                                <Text className="text-blue-400 text-xs font-bold">
                                  1
                                </Text>
                              </View>
                              <Text className="text-slate-300 text-xs flex-1">
                                R$ {strategy.firstBet.toFixed(2)} na 1ª dúzia
                              </Text>
                            </View>

                            <View className="flex-row items-center">
                              <View className="w-6 h-6 bg-purple-500/20 rounded-full items-center justify-center mr-2">
                                <Text className="text-purple-400 text-xs font-bold">
                                  2
                                </Text>
                              </View>
                              <Text className="text-slate-300 text-xs flex-1">
                                R$ {strategy.firstBet.toFixed(2)} na 2ª dúzia
                              </Text>
                            </View>

                            <View className="flex-row items-center">
                              <View className="w-6 h-6 bg-amber-500/20 rounded-full items-center justify-center mr-2">
                                <Text className="text-amber-400 text-xs font-bold">
                                  =
                                </Text>
                              </View>
                              <Text className="text-amber-400 text-xs flex-1 font-bold">
                                Total investido: R$ {strategy.totalPerEntry.toFixed(2)}
                              </Text>
                            </View>

                            <View className="h-px bg-slate-700 my-2" />

                            <View className="flex-row items-center">
                              <View className="w-6 h-6 bg-emerald-500/20 rounded-full items-center justify-center mr-2">
                                <Text className="text-emerald-400 text-xs font-bold">
                                  ✓
                                </Text>
                              </View>
                              <Text className="text-emerald-300 text-xs flex-1 font-bold">
                                Se GANHAR: Lucro de R${" "}
                                {strategy.profitPerEntry.toFixed(2)} ✓
                              </Text>
                            </View>
                          </View>
                        </View>

                        {/* Aviso de RED */}
                        <View className="bg-red-500/10 rounded-xl p-4 border-2 border-red-500/30">
                          <View className="flex-row items-center mb-2">
                            <Ionicons
                              name="alert-circle"
                              size={18}
                              color="#ef4444"
                              style={{ marginRight: 6 }}
                            />
                            <Text className="text-red-400 text-xs font-bold">
                              CASO DÊ RED (PERDA)
                            </Text>
                          </View>
                          <Text className="text-red-300 text-xs">
                            TRIPLIQUE o valor da aposta na próxima entrada para recuperar
                          </Text>
                        </View>

                        {/* Resumo Final */}
                        <View className="mt-4 pt-4 border-t-2 border-slate-700">
                          <Text className="text-slate-400 text-xs mb-2">
                            Resumo da Estratégia:
                          </Text>
                          <Text className="text-white text-sm">
                            • Faça <Text className="font-bold">{strategy.entriesNeeded} entradas</Text>
                          </Text>
                          <Text className="text-white text-sm">
                            • R$ {strategy.firstBet.toFixed(2)} em CADA dúzia (total R$ {strategy.totalPerEntry.toFixed(2)})
                          </Text>
                          <Text className="text-white text-sm">
                            • Lucro por entrada: R$ {strategy.profitPerEntry.toFixed(2)}
                          </Text>
                          <Text className="text-white text-sm">
                            • Meta final: <Text className={`font-bold ${color.text}`}>R$ {dailyGoal}</Text>
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Dicas de Gestão */}
                <View className="mt-6 bg-purple-500/10 rounded-2xl p-5 border-2 border-purple-500/30">
                  <View className="flex-row items-center mb-3">
                    <Ionicons
                      name="bulb"
                      size={24}
                      color="#a855f7"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-purple-400 text-lg font-bold">
                      Dicas Importantes
                    </Text>
                  </View>

                  <View className="space-y-2">
                    <View className="flex-row">
                      <Text className="text-purple-400 mr-2">•</Text>
                      <Text className="text-purple-300 text-sm flex-1">
                        Estratégias com menos entradas são mais agressivas
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-purple-400 mr-2">•</Text>
                      <Text className="text-purple-300 text-sm flex-1">
                        Estratégias com mais entradas são mais seguras
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-purple-400 mr-2">•</Text>
                      <Text className="text-purple-300 text-sm flex-1">
                        Use o app para identificar padrões antes de entrar
                      </Text>
                    </View>
                    <View className="flex-row">
                      <Text className="text-purple-400 mr-2">•</Text>
                      <Text className="text-purple-300 text-sm flex-1">
                        Pare ao atingir a meta diária para proteger seu lucro
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {showResults && strategies.length === 0 && (
              <View className="px-6 mb-6">
                <View className="bg-red-500/10 rounded-2xl p-6 border-2 border-red-500">
                  <View className="items-center">
                    <Ionicons
                      name="alert-circle"
                      size={48}
                      color="#ef4444"
                      style={{ marginBottom: 12 }}
                    />
                    <Text className="text-red-400 text-xl font-bold mb-2">
                      Banca Insuficiente
                    </Text>
                    <Text className="text-red-300 text-center">
                      Sua banca é muito baixa para atingir essa meta com segurança.
                      Reduza a meta ou aumente sua banca.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View className="h-20" />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

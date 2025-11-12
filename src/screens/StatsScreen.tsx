// Tela de Estatísticas Avançadas
import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useStatsStore } from "../state/statsStore";
import { useBankrollStore } from "../state/bankrollStore";

type StatsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Stats">;
};

const StatsScreen: React.FC<StatsScreenProps> = ({ navigation }) => {
  const { stats, userLevel, xp, getWinRate } = useStatsStore();
  const { dailyResults } = useBankrollStore();

  const winRate = getWinRate();
  const xpForNextLevel = ((userLevel) * 100) - xp;

  // Calcula melhor horário baseado em lucro
  const calculateBestLive = () => {
    const liveStats: { [key: string]: { profit: number; count: number } } = {};

    dailyResults.forEach((day) => {
      day.lives.forEach((live) => {
        if (!liveStats[live.time]) {
          liveStats[live.time] = { profit: 0, count: 0 };
        }
        liveStats[live.time].profit += live.profit;
        liveStats[live.time].count += 1;
      });
    });

    let bestLive = "Sem dados";
    let bestAvg = -Infinity;

    Object.keys(liveStats).forEach((time) => {
      const avg = liveStats[time].profit / liveStats[time].count;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestLive = time;
      }
    });

    return { bestLive, avgProfit: bestAvg };
  };

  const { bestLive, avgProfit } = calculateBestLive();

  // Calcula performance semanal
  const lastWeekResults = dailyResults.slice(-7);
  const weeklyProfit = lastWeekResults.reduce((sum, day) => sum + day.totalProfit, 0);
  const profitableDays = lastWeekResults.filter((day) => day.totalProfit > 0).length;

  return (
    <View className="flex-1 bg-slate-950">
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="px-6 pt-4 pb-6">
              <View className="flex-row items-center justify-between mb-6">
                <Pressable
                  onPress={() => navigation.goBack()}
                  className="w-12 h-12 bg-slate-800 rounded-full items-center justify-center active:opacity-70"
                >
                  <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Text className="text-white text-2xl font-bold">Estatísticas</Text>
                <Pressable
                  onPress={() => navigation.navigate("Achievements")}
                  className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center active:opacity-70"
                >
                  <Ionicons name="trophy" size={24} color="white" />
                </Pressable>
              </View>

              {/* Nível e XP */}
              <View className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-6 mb-6 border-2 border-purple-400">
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-purple-200 text-sm">Seu Nível</Text>
                    <Text className="text-white text-4xl font-black">
                      Nível {userLevel}
                    </Text>
                  </View>
                  <View className="w-20 h-20 bg-purple-500 rounded-full items-center justify-center">
                    <Ionicons name="star" size={40} color="white" />
                  </View>
                </View>
                <View className="bg-purple-900/50 rounded-full h-3 mb-2">
                  <View
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full"
                    style={{
                      width: `${((xp % 100) / 100) * 100}%`,
                    }}
                  />
                </View>
                <Text className="text-purple-300 text-sm text-center">
                  {xp % 100} / 100 XP • Faltam {xpForNextLevel} XP para próximo nível
                </Text>
              </View>

              {/* Taxa de Acerto */}
              {stats.followedEntries > 0 && (
                <View className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 mb-6 border-2 border-slate-700">
                  <View className="flex-row items-center mb-4">
                    <View className="w-12 h-12 bg-green-500 rounded-2xl items-center justify-center mr-3">
                      <Ionicons name="analytics" size={28} color="white" />
                    </View>
                    <Text className="text-white font-black text-2xl">
                      Taxa de Acerto
                    </Text>
                  </View>

                  <View className="items-center mb-4">
                    <Text className="text-6xl font-black text-white mb-2">
                      {winRate.toFixed(1)}%
                    </Text>
                    <Text className="text-slate-400 text-base">
                      {stats.wins} vitórias de {stats.followedEntries} entradas
                    </Text>
                  </View>

                  <View className="flex-row justify-around pt-4 border-t border-slate-700">
                    <View className="items-center">
                      <View className="w-12 h-12 bg-green-500/20 rounded-xl items-center justify-center mb-2">
                        <Ionicons name="checkmark-circle" size={28} color="#22c55e" />
                      </View>
                      <Text className="text-green-400 text-2xl font-bold">
                        {stats.wins}
                      </Text>
                      <Text className="text-slate-400 text-sm">Wins</Text>
                    </View>
                    <View className="items-center">
                      <View className="w-12 h-12 bg-red-500/20 rounded-xl items-center justify-center mb-2">
                        <Ionicons name="close-circle" size={28} color="#ef4444" />
                      </View>
                      <Text className="text-red-400 text-2xl font-bold">
                        {stats.losses}
                      </Text>
                      <Text className="text-slate-400 text-sm">Losses</Text>
                    </View>
                    <View className="items-center">
                      <View className="w-12 h-12 bg-purple-500/20 rounded-xl items-center justify-center mb-2">
                        <Ionicons name="trending-up" size={28} color="#a855f7" />
                      </View>
                      <Text className="text-purple-400 text-2xl font-bold">
                        {stats.totalProfit >= 0 ? "+" : ""}
                        {stats.totalProfit.toFixed(0)}
                      </Text>
                      <Text className="text-slate-400 text-sm">Lucro Total</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Melhor Horário */}
              {bestLive !== "Sem dados" && (
                <View className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-3xl p-6 mb-6 border-2 border-blue-500/50">
                  <View className="flex-row items-center mb-4">
                    <View className="w-12 h-12 bg-blue-500 rounded-2xl items-center justify-center mr-3">
                      <Ionicons name="time" size={28} color="white" />
                    </View>
                    <Text className="text-white font-black text-xl">
                      Melhor Horário
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-5xl font-black text-white mb-2">
                      {bestLive}
                    </Text>
                    <Text className="text-blue-300 text-base">
                      Lucro médio: R$ {avgProfit.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Performance Semanal */}
              <View className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 rounded-3xl p-6 mb-6 border-2 border-yellow-500/50">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-yellow-500 rounded-2xl items-center justify-center mr-3">
                    <Ionicons name="calendar" size={28} color="white" />
                  </View>
                  <Text className="text-white font-black text-xl">
                    Últimos 7 Dias
                  </Text>
                </View>
                <View className="flex-row justify-around">
                  <View className="items-center">
                    <Text className="text-white text-3xl font-bold mb-1">
                      {profitableDays}/7
                    </Text>
                    <Text className="text-yellow-300 text-sm">Dias Lucrativos</Text>
                  </View>
                  <View className="items-center">
                    <Text className={`text-3xl font-bold mb-1 ${weeklyProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {weeklyProfit >= 0 ? "+" : ""}R${weeklyProfit.toFixed(2)}
                    </Text>
                    <Text className="text-yellow-300 text-sm">Lucro Semanal</Text>
                  </View>
                </View>
              </View>

              {/* Sequência Atual */}
              <View className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-3xl p-6 border-2 border-purple-500/40">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-purple-500 rounded-2xl items-center justify-center mr-3">
                    <Ionicons name="flame" size={28} color="white" />
                  </View>
                  <Text className="text-white font-black text-xl">
                    Sequência de Uso
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-5xl font-black text-white mb-2">
                    {stats.currentStreak} dias
                  </Text>
                  <Text className="text-purple-300 text-base">
                    Continue assim! 🔥
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default StatsScreen;

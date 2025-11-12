// Tela de Histórico
import React from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useRouletteStore } from "../state/rouletteStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "History">;
};

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const analysisHistory = useRouletteStore((s) => s.analysisHistory);
  const userStats = useRouletteStore((s) => s.userStats);

  const getScoreIcon = (score: string) => {
    switch (score) {
      case "alavancar":
        return { icon: "rocket" as const, color: "text-purple-500" };
      case "bom":
        return { icon: "trending-up" as const, color: "text-yellow-500" };
      default:
        return { icon: "close-circle" as const, color: "text-red-500" };
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <View className="flex-row items-center justify-between mb-6">
              <Pressable
                onPress={() => navigation.goBack()}
                className="w-12 h-12 bg-slate-800 rounded-full items-center justify-center active:opacity-70"
              >
                <Ionicons name="arrow-back" size={24} color="#a855f7" />
              </Pressable>
              <Text className="text-white text-xl font-bold">Histórico</Text>
              <View className="w-12" />
            </View>

            {/* Stats Overview */}
            <View className="bg-slate-800 rounded-2xl p-5 mb-6">
              <Text className="text-white font-bold text-lg mb-4">
                Suas Estatísticas
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-slate-400 text-sm mb-1">Total</Text>
                  <Text className="text-white text-2xl font-bold">
                    {userStats.totalAnalyses}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-yellow-400 text-sm mb-1">Bons</Text>
                  <Text className="text-white text-2xl font-bold">
                    {userStats.bonsEncontrados}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-purple-400 text-sm mb-1">Alavancas</Text>
                  <Text className="text-white text-2xl font-bold">
                    {userStats.alavancasEncontradas}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-slate-400 text-sm mb-1">Taxa</Text>
                  <Text className="text-white text-2xl font-bold">
                    {userStats.totalAnalyses > 0
                      ? Math.round(
                          ((userStats.bonsEncontrados + userStats.alavancasEncontradas) /
                            userStats.totalAnalyses) *
                            100
                        )
                      : 0}
                    %
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* History List */}
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {analysisHistory.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Ionicons name="folder-open-outline" size={64} color="#475569" />
                <Text className="text-slate-400 text-center mt-4 text-lg">
                  Nenhuma análise ainda
                </Text>
                <Text className="text-slate-500 text-center mt-2">
                  Suas análises aparecerão aqui
                </Text>
              </View>
            ) : (
              <View className="space-y-4 pb-6">
                {analysisHistory.map((analysis) => {
                  const scoreData = getScoreIcon(analysis.overallScore);
                  return (
                    <Pressable
                      key={analysis.id}
                      onPress={() => navigation.navigate("Results", { analysis, fromHistory: true })}
                      className="bg-slate-800 rounded-2xl overflow-hidden active:opacity-80"
                    >
                      <View className="flex-row">
                        {/* Image */}
                        <Image
                          source={{ uri: analysis.imageUri }}
                          className="w-24 h-24"
                          resizeMode="cover"
                        />

                        {/* Info */}
                        <View className="flex-1 p-4 justify-between">
                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                              <Ionicons
                                name={scoreData.icon}
                                size={20}
                                color={
                                  scoreData.color === "text-purple-500"
                                    ? "#a855f7"
                                    : scoreData.color === "text-yellow-500"
                                    ? "#eab308"
                                    : "#ef4444"
                                }
                              />
                              <Text
                                className={`${scoreData.color} font-bold ml-2 capitalize`}
                              >
                                {analysis.overallScore}
                              </Text>
                            </View>
                            <Text className="text-slate-500 text-xs">
                              {format(analysis.timestamp, "dd/MM/yy HH:mm", {
                                locale: ptBR,
                              })}
                            </Text>
                          </View>

                          <Text className="text-slate-300 text-sm mt-2" numberOfLines={2}>
                            {analysis.opportunities.length} oportunidade
                            {analysis.opportunities.length !== 1 ? "s" : ""} detectada
                            {analysis.opportunities.length !== 1 ? "s" : ""}
                          </Text>

                          <Text className="text-slate-400 text-xs mt-1">
                            {analysis.detectedNumbers.length} números analisados
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default HistoryScreen;

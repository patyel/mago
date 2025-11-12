// Tela de Resultados - Mostra a análise completa
import React from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootNavigator";
import { RouletteOpportunity } from "../types/roulette";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type ResultsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Results">;
  route: RouteProp<RootStackParamList, "Results">;
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ navigation, route }) => {
  const { analysis } = route.params;

  const getScoreColor = () => {
    switch (analysis.overallScore) {
      case "alavancar":
        return { bg: "bg-purple-500", text: "text-purple-500", icon: "rocket" as const };
      case "bom":
        return { bg: "bg-yellow-500", text: "text-yellow-500", icon: "trending-up" as const };
      default:
        return { bg: "bg-red-500", text: "text-red-500", icon: "close-circle" as const };
    }
  };

  const getScoreLabel = () => {
    switch (analysis.overallScore) {
      case "alavancar":
        return "Momento de Alavancar!";
      case "bom":
        return "Bom Momento";
      default:
        return "Momento Fraco";
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case "alavancar":
        return "bg-purple-500";
      case "bom":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  const scoreData = getScoreColor();

  return (
    <View className="flex-1 bg-slate-950">
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="px-6 pt-4 pb-6">
              <View className="flex-row items-center justify-between mb-6">
                <Pressable
                  onPress={() => navigation.navigate("Home")}
                  className="w-12 h-12 bg-slate-800 rounded-full items-center justify-center active:opacity-70"
                >
                  <Ionicons name="home" size={24} color="#a855f7" />
                </Pressable>
                <Text className="text-white text-xl font-bold">Resultado</Text>
                <View className="w-12" />
              </View>

              {/* Score Card */}
              <View className={`${scoreData.bg} rounded-3xl p-8 items-center mb-6 border-4 border-white/20`}>
                <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4">
                  <Ionicons name={scoreData.icon} size={64} color="white" />
                </View>
                <Text className="text-white text-4xl font-black mt-2 text-center">
                  {getScoreLabel()}
                </Text>
                <View className="bg-white/20 rounded-full px-6 py-3 mt-4">
                  <Text className="text-white font-bold text-lg text-center">
                    {analysis.opportunities.length} {analysis.opportunities.length === 1 ? "Entrada" : "Entradas"} Detectadas
                  </Text>
                </View>
                <Text className="text-white/95 text-center mt-4 text-base leading-6 font-semibold">
                  {analysis.recommendation.split("\n\n")[0]}
                </Text>
              </View>

              {/* Image Preview */}
              <View className="rounded-3xl overflow-hidden mb-6 border-2 border-purple-500/40">
                <Image
                  source={{ uri: analysis.imageUri }}
                  className="w-full h-56"
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Opportunities */}
            <View className="px-6 pb-8">
              <Text className="text-white text-3xl font-black mb-6 text-center">
                🎯 Suas Entradas
              </Text>

              {analysis.opportunities.length === 0 ? (
                <View className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 items-center border-2 border-slate-700">
                  <View className="w-20 h-20 bg-slate-700 rounded-full items-center justify-center mb-4">
                    <Ionicons name="sad-outline" size={48} color="#94a3b8" />
                  </View>
                  <Text className="text-white text-xl font-bold text-center mb-2">
                    Nenhuma Oportunidade Forte
                  </Text>
                  <Text className="text-slate-400 text-center leading-6">
                    Aguarde por padrões com 4+ sequências.{"\n"}
                    O Mago te avisará quando aparecer!
                  </Text>
                </View>
              ) : (
                <View className="space-y-4">
                  {analysis.opportunities.map((opp, index) => (
                    <View
                      key={index}
                      className={`${
                        opp.confidence === "alavancar"
                          ? "bg-gradient-to-r from-purple-900/40 to-purple-800/40 border-purple-500/50"
                          : opp.confidence === "bom"
                          ? "bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border-yellow-500/50"
                          : "bg-gradient-to-r from-red-900/40 to-red-800/40 border-red-500/50"
                      } rounded-3xl p-6 border-2`}
                    >
                      {/* Header */}
                      <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                          <View
                            className={`${getConfidenceBadge(
                              opp.confidence
                            )} w-12 h-12 rounded-2xl items-center justify-center mr-3`}
                          >
                            <Ionicons
                              name={opp.confidence === "alavancar" ? "rocket" : opp.confidence === "bom" ? "thumbs-up" : "close-circle"}
                              size={24}
                              color="white"
                            />
                          </View>
                          <View>
                            <Text className="text-white font-black text-xl capitalize">
                              {opp.type === "color"
                                ? "Cor"
                                : opp.type === "dozen"
                                ? "Dúzias"
                                : "Colunas"}
                            </Text>
                            <Text
                              className={`${
                                opp.confidence === "alavancar"
                                  ? "text-purple-300"
                                  : opp.confidence === "bom"
                                  ? "text-yellow-300"
                                  : "text-red-300"
                              } text-sm font-bold uppercase`}
                            >
                              {opp.confidence === "alavancar"
                                ? "🚀 Alavancar"
                                : opp.confidence === "bom"
                                ? "👍 Bom"
                                : "⚠️ Fraco"}
                            </Text>
                          </View>
                        </View>
                        <View className="bg-white/20 px-4 py-2 rounded-xl">
                          <Text className="text-white font-black text-lg">
                            {opp.sequenceCount}x
                          </Text>
                        </View>
                      </View>

                      {/* Bet Info */}
                      <View className="bg-slate-900 rounded-2xl p-5">
                        <Text className="text-slate-400 text-sm mb-2 font-semibold">
                          💰 Entre em:
                        </Text>
                        <Text className="text-white text-2xl font-black">
                          {opp.betOn.join(" + ")}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View className="px-6 pb-6 flex-row space-x-3">
            <Pressable
              onPress={() => navigation.navigate("Camera")}
              className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl py-5 items-center active:opacity-80 border border-slate-600"
            >
              <View className="flex-row items-center">
                <Ionicons name="camera" size={22} color="white" />
                <Text className="text-white font-bold text-base ml-2">Nova Análise</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Home")}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl py-5 items-center active:opacity-80 border-2 border-purple-400"
            >
              <View className="flex-row items-center">
                <Ionicons name="home" size={22} color="white" />
                <Text className="text-white font-bold text-base ml-2">Início</Text>
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default ResultsScreen;

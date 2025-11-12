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
        return { bg: "bg-emerald-500", text: "text-emerald-500", icon: "rocket" as const };
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
        return "bg-emerald-500";
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
                  <Ionicons name="home" size={24} color="#10b981" />
                </Pressable>
                <Text className="text-white text-xl font-bold">Resultado</Text>
                <View className="w-12" />
              </View>

              {/* Score Card */}
              <View className={`${scoreData.bg} rounded-3xl p-6 items-center mb-6`}>
                <Ionicons name={scoreData.icon} size={64} color="white" />
                <Text className="text-white text-3xl font-bold mt-4">
                  {getScoreLabel()}
                </Text>
                <Text className="text-white/90 text-center mt-2 text-base">
                  {analysis.recommendation}
                </Text>
              </View>

              {/* Image Preview */}
              <View className="rounded-2xl overflow-hidden mb-6 border border-slate-700">
                <Image
                  source={{ uri: analysis.imageUri }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Opportunities */}
            <View className="px-6 pb-8">
              <Text className="text-white text-2xl font-bold mb-4">
                Oportunidades Detectadas
              </Text>

              {analysis.opportunities.length === 0 ? (
                <View className="bg-slate-800 rounded-2xl p-6 items-center">
                  <Ionicons name="sad-outline" size={48} color="#94a3b8" />
                  <Text className="text-slate-400 text-center mt-4">
                    Nenhuma oportunidade forte detectada.{"\n"}
                    Aguarde por padrões com 4+ sequências.
                  </Text>
                </View>
              ) : (
                <View className="space-y-4">
                  {analysis.opportunities.map((opp, index) => (
                    <View
                      key={index}
                      className="bg-slate-800 rounded-2xl p-5 border border-slate-700"
                    >
                      {/* Header */}
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center">
                          <View
                            className={`${getConfidenceBadge(
                              opp.confidence
                            )} w-3 h-3 rounded-full mr-2`}
                          />
                          <Text className="text-white font-bold text-lg capitalize">
                            {opp.type === "color"
                              ? "Cor"
                              : opp.type === "dozen"
                              ? "Dúzias"
                              : "Colunas"}
                          </Text>
                        </View>
                        <View className="bg-slate-900 px-3 py-1 rounded-full">
                          <Text className="text-white font-bold">
                            {opp.sequenceCount}x
                          </Text>
                        </View>
                      </View>

                      {/* Bet Info */}
                      <View className="bg-slate-900 rounded-xl p-4">
                        <Text className="text-slate-400 text-sm mb-2">
                          Entre em:
                        </Text>
                        <Text className="text-white text-xl font-bold">
                          {opp.betOn.join(" + ")}
                        </Text>
                      </View>

                      {/* Confidence Badge */}
                      <View className="mt-3">
                        <Text
                          className={`${
                            opp.confidence === "alavancar"
                              ? "text-emerald-400"
                              : opp.confidence === "bom"
                              ? "text-yellow-400"
                              : "text-red-400"
                          } text-sm font-semibold uppercase`}
                        >
                          {opp.confidence === "alavancar"
                            ? "🚀 Alavancar"
                            : opp.confidence === "bom"
                            ? "👍 Bom"
                            : "⚠️ Fraco"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Numbers Detected */}
              <View className="mt-6 bg-slate-800 rounded-2xl p-5">
                <Text className="text-white font-bold text-lg mb-3">
                  Números Detectados ({analysis.detectedNumbers.length})
                </Text>
                <View className="flex-row flex-wrap">
                  {analysis.detectedNumbers.map((result, index) => (
                    <View
                      key={index}
                      className={`w-10 h-10 rounded-full items-center justify-center mr-2 mb-2 ${
                        result.color === "red"
                          ? "bg-red-500"
                          : result.color === "black"
                          ? "bg-black border border-white"
                          : "bg-green-600"
                      }`}
                    >
                      <Text className="text-white font-bold">{result.number}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View className="px-6 pb-6 flex-row space-x-3">
            <Pressable
              onPress={() => navigation.navigate("Camera")}
              className="flex-1 bg-slate-800 rounded-2xl py-4 items-center active:opacity-80"
            >
              <Text className="text-white font-bold">Nova Análise</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Home")}
              className="flex-1 bg-emerald-500 rounded-2xl py-4 items-center active:opacity-80"
            >
              <Text className="text-white font-bold">Voltar ao Início</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default ResultsScreen;

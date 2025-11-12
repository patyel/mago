// Tela Home - Principal
import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useRouletteStore } from "../state/rouletteStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const userStats = useRouletteStore((s) => s.userStats);

  return (
    <View className="flex-1 bg-slate-950">
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1">
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="mt-8 mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 bg-purple-500 rounded-xl items-center justify-center mr-2">
                      <Ionicons name="sparkles" size={24} color="white" />
                    </View>
                    <Text className="text-4xl font-black text-white">App do Mago</Text>
                  </View>
                  <Text className="text-purple-300 text-base font-semibold">
                    ✨ A IA que trabalha pra você
                  </Text>
                </View>
                <Pressable
                  onPress={() => navigation.navigate("History")}
                  className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl items-center justify-center active:opacity-70 border-2 border-purple-400"
                >
                  <Ionicons name="time" size={28} color="white" />
                </Pressable>
              </View>
            </View>

            {/* Stats Cards */}
            <View className="mb-8">
              <Text className="text-white text-xl font-bold mb-4">
                📊 Suas Estatísticas
              </Text>
              <View className="flex-row justify-between">
                <View className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 mr-2 border border-slate-700">
                  <View className="w-10 h-10 bg-blue-500 rounded-xl items-center justify-center mb-3">
                    <Ionicons name="stats-chart" size={24} color="white" />
                  </View>
                  <Text className="text-slate-400 text-sm mb-1 font-semibold">Total</Text>
                  <Text className="text-white text-4xl font-black">
                    {userStats.totalAnalyses}
                  </Text>
                </View>
                <View className="flex-1 bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 rounded-2xl p-5 mx-1 border border-yellow-500/50">
                  <View className="w-10 h-10 bg-yellow-500 rounded-xl items-center justify-center mb-3">
                    <Ionicons name="thumbs-up" size={24} color="white" />
                  </View>
                  <Text className="text-yellow-200 text-sm mb-1 font-semibold">Bons</Text>
                  <Text className="text-white text-4xl font-black">
                    {userStats.bonsEncontrados}
                  </Text>
                </View>
                <View className="flex-1 bg-gradient-to-br from-purple-900/40 to-purple-800/40 rounded-2xl p-5 ml-2 border border-purple-500/50">
                  <View className="w-10 h-10 bg-purple-500 rounded-xl items-center justify-center mb-3">
                    <Ionicons name="rocket" size={24} color="white" />
                  </View>
                  <Text className="text-purple-200 text-sm mb-1 font-semibold">Alavancar</Text>
                  <Text className="text-white text-4xl font-black">
                    {userStats.alavancasEncontradas}
                  </Text>
                </View>
              </View>
            </View>

            {/* Main Action Button */}
            <View className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-1 mb-8">
              <Pressable
                onPress={() => navigation.navigate("Camera")}
                className="bg-slate-900 rounded-3xl p-8 items-center active:opacity-90"
              >
                <View className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full items-center justify-center mb-4 border-4 border-purple-300">
                  <Ionicons name="images" size={48} color="white" />
                </View>
                <Text className="text-white text-3xl font-black mb-2 text-center">
                  📸 Enviar Foto da Mesa
                </Text>
                <Text className="text-purple-200 text-center text-base leading-6 font-semibold">
                  Escolha uma foto do painel e deixe{"\n"}a magia da IA encontrar suas entradas
                </Text>
                <View className="flex-row items-center mt-4 bg-purple-500/20 px-4 py-2 rounded-full">
                  <Ionicons name="flash" size={16} color="#a855f7" />
                  <Text className="text-purple-300 text-sm font-bold ml-1">
                    Análise em segundos
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Info Cards */}
            <View className="space-y-4 mb-8">
              <View className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-blue-500 rounded-2xl items-center justify-center mr-3">
                    <Ionicons name="help-circle" size={28} color="white" />
                  </View>
                  <Text className="text-white font-black text-xl">
                    Como Usar
                  </Text>
                </View>
                <View className="space-y-3">
                  <View className="flex-row items-start">
                    <View className="w-6 h-6 bg-purple-500 rounded-full items-center justify-center mr-3 mt-1">
                      <Text className="text-white font-bold text-xs">1</Text>
                    </View>
                    <Text className="text-slate-300 leading-6 flex-1 font-medium">
                      📸 Envie uma foto do painel com os últimos resultados
                    </Text>
                  </View>
                  <View className="flex-row items-start">
                    <View className="w-6 h-6 bg-purple-500 rounded-full items-center justify-center mr-3 mt-1">
                      <Text className="text-white font-bold text-xs">2</Text>
                    </View>
                    <Text className="text-slate-300 leading-6 flex-1 font-medium">
                      🤖 Aguarde a magia da IA analisar tudo pra você
                    </Text>
                  </View>
                  <View className="flex-row items-start">
                    <View className="w-6 h-6 bg-purple-500 rounded-full items-center justify-center mr-3 mt-1">
                      <Text className="text-white font-bold text-xs">3</Text>
                    </View>
                    <Text className="text-slate-300 leading-6 flex-1 font-medium">
                      🎯 Receba suas entradas e recomendações prontas!
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-gradient-to-r from-purple-900/40 to-purple-800/40 rounded-2xl p-6 border-2 border-purple-500/40">
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-purple-500 rounded-2xl items-center justify-center mr-3">
                    <Ionicons name="sparkles" size={28} color="white" />
                  </View>
                  <Text className="text-white font-black text-xl">
                    Por Que Funciona?
                  </Text>
                </View>
                <Text className="text-purple-100 leading-7 font-medium">
                  Operamos <Text className="text-white font-bold">a favor da sequência</Text>. Buscamos padrões de <Text className="text-purple-300 font-bold">4+ repetições</Text> em dúzias e colunas.{"\n\n"}
                  <Text className="text-yellow-300 font-bold">Quanto maior a sequência, melhor a oportunidade!</Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default HomeScreen;

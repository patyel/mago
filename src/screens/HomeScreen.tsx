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
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-3xl font-bold text-white">RoletaPro</Text>
                <Pressable
                  onPress={() => navigation.navigate("History")}
                  className="w-12 h-12 bg-slate-800 rounded-full items-center justify-center active:opacity-70"
                >
                  <Ionicons name="time" size={24} color="#10b981" />
                </Pressable>
              </View>
              <Text className="text-slate-400 text-base">
                Analise padrões e encontre as melhores entradas
              </Text>
            </View>

            {/* Stats Cards */}
            <View className="flex-row justify-between mb-8">
              <View className="flex-1 bg-slate-800 rounded-2xl p-4 mr-2">
                <Text className="text-slate-400 text-sm mb-1">Total</Text>
                <Text className="text-white text-3xl font-bold">
                  {userStats.totalAnalyses}
                </Text>
              </View>
              <View className="flex-1 bg-slate-800 rounded-2xl p-4 mx-1">
                <Text className="text-yellow-400 text-sm mb-1">Bons</Text>
                <Text className="text-white text-3xl font-bold">
                  {userStats.bonsEncontrados}
                </Text>
              </View>
              <View className="flex-1 bg-slate-800 rounded-2xl p-4 ml-2">
                <Text className="text-emerald-400 text-sm mb-1">Alavancas</Text>
                <Text className="text-white text-3xl font-bold">
                  {userStats.alavancasEncontradas}
                </Text>
              </View>
            </View>

            {/* Main Action Button */}
            <Pressable
              onPress={() => navigation.navigate("Camera")}
              className="bg-emerald-500 rounded-3xl p-8 items-center mb-8 active:opacity-80"
            >
              <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4">
                <Ionicons name="camera" size={40} color="#10b981" />
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                Analisar Mesa
              </Text>
              <Text className="text-emerald-100 text-center">
                Tire uma foto do painel e descubra as melhores entradas
              </Text>
            </Pressable>

            {/* Info Cards */}
            <View className="space-y-4 mb-8">
              <View className="bg-slate-800 rounded-2xl p-5">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="flash" size={24} color="#fbbf24" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Como Usar
                  </Text>
                </View>
                <Text className="text-slate-300 leading-6">
                  1. Fotografe o painel da roleta com os últimos resultados{"\n"}
                  2. Aguarde a análise da IA{"\n"}
                  3. Receba suas entradas e recomendações
                </Text>
              </View>

              <View className="bg-slate-800 rounded-2xl p-5">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="trending-up" size={24} color="#10b981" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Estratégia
                  </Text>
                </View>
                <Text className="text-slate-300 leading-6">
                  Operamos a favor da sequência. Buscamos padrões de 4+ repetições em cores, dúzias e colunas. Quanto maior a sequência, melhor a oportunidade!
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

// Tela de Onboarding
import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useRouletteStore } from "../state/rouletteStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Onboarding">;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const completeOnboarding = useRouletteStore((s) => s.completeOnboarding);
  const hasCompleted = useRouletteStore((s) => s.hasCompletedOnboarding);

  React.useEffect(() => {
    if (hasCompleted) {
      navigation.replace("Home");
    }
  }, [hasCompleted, navigation]);

  const handleStart = () => {
    completeOnboarding();
    navigation.replace("Home");
  };

  return (
    <View className="flex-1 bg-slate-950">
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1">
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="items-center mt-12 mb-8">
              <View className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full items-center justify-center mb-6 shadow-2xl">
                <Ionicons name="sparkles" size={64} color="white" />
              </View>
              <Text className="text-5xl font-black text-white text-center mb-2">
                App do Mago
              </Text>
              <Text className="text-xl text-purple-300 text-center font-semibold">
                ✨ A Magia da IA nas Suas Mãos
              </Text>
            </View>

            {/* Copy Persuasivo */}
            <View className="bg-gradient-to-r from-purple-900/40 to-purple-800/40 rounded-3xl p-6 mb-8 border-2 border-purple-500/30">
              <Text className="text-white text-center text-lg font-bold mb-3">
                Não sabe analisar padrões?
              </Text>
              <Text className="text-purple-200 text-center text-base leading-7">
                Relaxa! 😌 O Mago analisa tudo pra você.{"\n"}
                Envie uma foto e deixe a IA trabalhar.{"\n"}
                <Text className="text-purple-300 font-bold">Simples, rápido e preciso!</Text>
              </Text>
            </View>

            {/* Como funciona */}
            <View className="mt-4">
              <Text className="text-3xl font-black text-white mb-6 text-center">
                🎯 Como Funciona
              </Text>

              <View className="space-y-6">
                {/* Passo 1 */}
                <View className="bg-slate-800/80 rounded-3xl p-5 border-2 border-purple-500/20">
                  <View className="flex-row items-start">
                    <View className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl items-center justify-center mr-4 shadow-lg">
                      <Text className="text-white font-black text-xl">1</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-xl mb-2">
                        📸 Tire ou Envie a Foto
                      </Text>
                      <Text className="text-slate-300 text-base leading-6">
                        Qualquer painel serve! Seja da mesa ou até print do celular
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Passo 2 */}
                <View className="bg-slate-800/80 rounded-3xl p-5 border-2 border-purple-500/20">
                  <View className="flex-row items-start">
                    <View className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl items-center justify-center mr-4 shadow-lg">
                      <Text className="text-white font-black text-xl">2</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-xl mb-2">
                        🤖 IA Faz a Mágica
                      </Text>
                      <Text className="text-slate-300 text-base leading-6">
                        Em segundos, detecta TODOS os padrões e sequências
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Passo 3 */}
                <View className="bg-slate-800/80 rounded-3xl p-5 border-2 border-purple-500/20">
                  <View className="flex-row items-start">
                    <View className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl items-center justify-center mr-4 shadow-lg">
                      <Text className="text-white font-black text-xl">3</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-xl mb-2">
                        🎯 Receba suas Entradas
                      </Text>
                      <Text className="text-slate-300 text-base leading-6">
                        Vê onde apostar, quantas sequências e se é bom pra alavancar!
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Estratégia */}
            <View className="mt-10 bg-gradient-to-r from-purple-900/50 to-purple-800/50 rounded-3xl p-6 border-2 border-purple-500/40">
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-purple-500 rounded-2xl items-center justify-center mr-3">
                  <Ionicons name="bulb" size={24} color="white" />
                </View>
                <Text className="text-2xl font-black text-white">
                  A Magia por Trás
                </Text>
              </View>
              <Text className="text-purple-100 leading-7 text-base">
                Operamos <Text className="text-white font-bold">a favor da sequência</Text>. Quando detectamos <Text className="text-purple-300 font-bold">4 ou mais repetições</Text> em dúzias ou colunas, você recebe uma entrada.{"\n\n"}
                <Text className="text-purple-300 font-bold">Sequências de 6 a 20?</Text> São oportunidades perfeitas de <Text className="text-yellow-300 font-bold">alavancagem!</Text>
              </Text>
            </View>

            {/* Classificação */}
            <View className="mt-8 mb-8">
              <Text className="text-3xl font-black text-white mb-6 text-center">
                ⚡ Sistema de Classificação
              </Text>

              <View className="space-y-4">
                {/* Ruim */}
                <View className="bg-gradient-to-r from-red-900/40 to-red-800/40 border-2 border-red-500/50 rounded-2xl p-5">
                  <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 bg-red-500 rounded-xl items-center justify-center mr-3">
                      <Ionicons name="close-circle" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-black text-xl">Momento Fraco</Text>
                      <Text className="text-red-200 text-sm font-semibold">
                        Menos de 4 sequências
                      </Text>
                    </View>
                  </View>
                  <Text className="text-red-100 text-sm ml-13">
                    ⏳ Aguarde! O Mago te avisará quando o padrão melhorar
                  </Text>
                </View>

                {/* Bom */}
                <View className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 border-2 border-yellow-500/50 rounded-2xl p-5">
                  <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 bg-yellow-500 rounded-xl items-center justify-center mr-3">
                      <Ionicons name="thumbs-up" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-black text-xl">Bom Momento</Text>
                      <Text className="text-yellow-200 text-sm font-semibold">
                        4 a 5 sequências
                      </Text>
                    </View>
                  </View>
                  <Text className="text-yellow-100 text-sm ml-13">
                    👍 Padrão confiável! Hora de entrar com segurança
                  </Text>
                </View>

                {/* Alavancar */}
                <View className="bg-gradient-to-r from-purple-900/40 to-purple-800/40 border-2 border-purple-500/50 rounded-2xl p-5">
                  <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 bg-purple-500 rounded-xl items-center justify-center mr-3">
                      <Ionicons name="rocket" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-black text-xl">Alavancar!</Text>
                      <Text className="text-purple-200 text-sm font-semibold">
                        6 a 20 sequências
                      </Text>
                    </View>
                  </View>
                  <Text className="text-purple-100 text-sm ml-13">
                    🚀 MOMENTO PERFEITO! Sequência forte para alavancagem
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Botão de começar */}
          <View className="px-6 pb-6">
            <Pressable
              onPress={handleStart}
              className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl py-5 items-center active:opacity-80 border-2 border-purple-400"
            >
              <View className="flex-row items-center">
                <Ionicons name="sparkles" size={24} color="white" />
                <Text className="text-white font-black text-xl ml-2">
                  Começar a Magia
                </Text>
                <Ionicons name="arrow-forward" size={24} color="white" style={{ marginLeft: 8 }} />
              </View>
            </Pressable>
            <Text className="text-center text-purple-300 text-sm mt-3 font-semibold">
              ✨ 100% grátis • Ilimitado • Sem pegadinhas
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default OnboardingScreen;

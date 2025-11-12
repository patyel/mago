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
              <View className="w-24 h-24 bg-emerald-500 rounded-full items-center justify-center mb-4">
                <Ionicons name="analytics" size={48} color="white" />
              </View>
              <Text className="text-4xl font-bold text-white text-center">
                RoletaPro
              </Text>
              <Text className="text-lg text-slate-400 text-center mt-2">
                Seu Assistente Inteligente de Roleta
              </Text>
            </View>

            {/* Como funciona */}
            <View className="mt-8">
              <Text className="text-2xl font-bold text-white mb-6">
                Como Funciona
              </Text>

              <View className="space-y-6">
                {/* Passo 1 */}
                <View className="flex-row items-start">
                  <View className="w-12 h-12 bg-emerald-500 rounded-full items-center justify-center mr-4">
                    <Text className="text-white font-bold text-lg">1</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-lg mb-1">
                      Tire uma Foto
                    </Text>
                    <Text className="text-slate-400">
                      Fotografe o painel da roleta mostrando os últimos resultados
                    </Text>
                  </View>
                </View>

                {/* Passo 2 */}
                <View className="flex-row items-start mt-6">
                  <View className="w-12 h-12 bg-emerald-500 rounded-full items-center justify-center mr-4">
                    <Text className="text-white font-bold text-lg">2</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-lg mb-1">
                      IA Analisa Padrões
                    </Text>
                    <Text className="text-slate-400">
                      Nossa IA detecta sequências em cores, dúzias e colunas
                    </Text>
                  </View>
                </View>

                {/* Passo 3 */}
                <View className="flex-row items-start mt-6">
                  <View className="w-12 h-12 bg-emerald-500 rounded-full items-center justify-center mr-4">
                    <Text className="text-white font-bold text-lg">3</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-lg mb-1">
                      Receba Entradas
                    </Text>
                    <Text className="text-slate-400">
                      Veja onde apostar e a qualidade de cada oportunidade
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Estratégia */}
            <View className="mt-10 bg-slate-800 rounded-2xl p-6">
              <View className="flex-row items-center mb-4">
                <Ionicons name="information-circle" size={24} color="#10b981" />
                <Text className="text-xl font-bold text-white ml-2">
                  Nossa Estratégia
                </Text>
              </View>
              <Text className="text-slate-300 leading-6">
                Operamos a favor da sequência. Quando detectamos 4 ou mais repetições em cores, dúzias ou colunas, você recebe uma entrada. Sequências de 6 a 20 são oportunidades de alavancagem!
              </Text>
            </View>

            {/* Classificação */}
            <View className="mt-8 mb-8">
              <Text className="text-xl font-bold text-white mb-4">
                Classificação de Padrões
              </Text>

              <View className="space-y-3">
                <View className="flex-row items-center bg-red-900/30 border border-red-700 rounded-xl p-4">
                  <View className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                  <View className="flex-1">
                    <Text className="text-white font-semibold">Ruim</Text>
                    <Text className="text-slate-400 text-sm">
                      Menos de 4 sequências - Aguarde
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center bg-yellow-900/30 border border-yellow-700 rounded-xl p-4">
                  <View className="w-3 h-3 bg-yellow-500 rounded-full mr-3" />
                  <View className="flex-1">
                    <Text className="text-white font-semibold">Bom</Text>
                    <Text className="text-slate-400 text-sm">
                      4-5 sequências - Momento favorável
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center bg-emerald-900/30 border border-emerald-700 rounded-xl p-4">
                  <View className="w-3 h-3 bg-emerald-500 rounded-full mr-3" />
                  <View className="flex-1">
                    <Text className="text-white font-semibold">Alavancar</Text>
                    <Text className="text-slate-400 text-sm">
                      6-20 sequências - Excelente!
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Botão de começar */}
          <View className="px-6 pb-6">
            <Pressable
              onPress={handleStart}
              className="bg-emerald-500 rounded-2xl py-4 items-center active:opacity-80"
            >
              <Text className="text-white font-bold text-lg">
                Começar Agora
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default OnboardingScreen;

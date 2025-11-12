// Tela de Análise - Processa a imagem com IA
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useRouletteStore } from "../state/rouletteStore";
import { useAccessCodeStore } from "../state/accessCodeStore";
import { analyzeRouletteResults } from "../utils/rouletteAnalyzer";
import { backendService } from "../services/backend";
import { getOpenAIClient } from "../api/openai";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";

type AnalysisScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Analysis">;
  route: RouteProp<RootStackParamList, "Analysis">;
};

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ navigation, route }) => {
  const { imageUri } = route.params;
  const [status, setStatus] = useState("Verificando acesso...");
  const [error, setError] = useState<string | null>(null);
  const setIsAnalyzing = useRouletteStore((s) => s.setIsAnalyzing);
  const addAnalysisToHistory = useRouletteStore((s) => s.addAnalysisToHistory);
  const setCurrentAnalysis = useRouletteStore((s) => s.setCurrentAnalysis);

  const codigo = useAccessCodeStore((s) => s.codigo);
  const isActive = useAccessCodeStore((s) => s.isActive);

  useEffect(() => {
    // Verifica se tem código ativo
    if (!codigo || !isActive) {
      setError("Código de acesso inválido ou expirado. Ative um novo código para continuar.");
      return;
    }
    analyzeImage();
  }, []);

  const analyzeImage = async () => {
    try {
      setIsAnalyzing(true);

      // Verifica código com o backend
      setStatus("Verificando código de acesso...");
      const verificacao = await backendService.verificarCodigo(codigo!);

      if (!verificacao.sucesso) {
        throw new Error(verificacao.erro);
      }

      // Lê a imagem como base64
      setStatus("Preparando imagem...");
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Analisa com OpenAI local
      setStatus("Analisando números da roleta...");
      const openai = getOpenAIClient();

      const prompt = `Você é um especialista em analisar painéis de roleta. Analise esta imagem e extraia os números do painel EXATAMENTE da ESQUERDA para DIREITA (ou de CIMA para BAIXO).

⚠️ SUPER IMPORTANTE - ORDEM DOS NÚMEROS:
- Leia os números da ESQUERDA → DIREITA (igual ler um livro)
- Se o painel for vertical, leia de CIMA → BAIXO
- O PRIMEIRO número que você vê (mais à esquerda/topo) = MAIS ANTIGO
- O ÚLTIMO número que você vê (mais à direita/embaixo) = MAIS RECENTE (última entrada)
- Retorne os números NESSA ORDEM EXATA

FORMATO DA RESPOSTA:
- Apenas números separados por vírgula
- Números devem estar entre 0 e 36
- Sem texto adicional

EXEMPLO VISUAL:
Painel mostra: [5] [12] [23] [8] [19] [3] [27]
              ↑                           ↑
           ANTIGO                    MAIS RECENTE

Sua resposta deve ser: 5,12,23,8,19,3,27

Se não conseguir identificar claramente, responda: "ERRO: Não foi possível identificar os números"`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      });

      const numbersText = response.choices[0].message.content?.trim() || "";

      if (numbersText.includes("ERRO")) {
        throw new Error("Não foi possível identificar os números da roleta na imagem");
      }

      // Parse dos números
      const numbers = numbersText
        .split(",")
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n) && n >= 0 && n <= 36);

      if (numbers.length < 4) {
        throw new Error("Poucos números detectados. Tire uma foto mais clara do painel com pelo menos 8 números visíveis");
      }

      console.log("📸 Números detectados pela IA:", numbers);
      console.log("🎯 Primeiro (antigo):", numbers[0]);
      console.log("🎯 Último (RECENTE):", numbers[numbers.length - 1]);

      // INVERTE a ordem porque a IA está lendo ao contrário
      // O primeiro número na lista é na verdade o MAIS RECENTE
      const numbersReversed = [...numbers].reverse();

      console.log("🔄 Números INVERTIDOS (ordem correta):", numbersReversed);
      console.log("✅ Agora primeiro (antigo):", numbersReversed[0]);
      console.log("✅ Agora último (RECENTE):", numbersReversed[numbersReversed.length - 1]);

      // Analisa os padrões
      setStatus("Analisando padrões e sequências...");
      const analysis = analyzeRouletteResults(numbersReversed, imageUri);

      // Salva e navega
      setCurrentAnalysis(analysis);
      addAnalysisToHistory(analysis);
      setIsAnalyzing(false);

      navigation.replace("Results", { analysis });
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Erro ao analisar a imagem");
      setIsAnalyzing(false);
    }
  };

  if (error) {
    return (
      <View className="flex-1 bg-slate-950">
        <LinearGradient colors={["#0f172a", "#1e293b"]} style={{ flex: 1 }}>
          <SafeAreaView className="flex-1 items-center justify-center px-6">
            <View className="w-20 h-20 bg-red-500/20 rounded-full items-center justify-center mb-6">
              <Ionicons name="alert-circle" size={48} color="#ef4444" />
            </View>
            <Text className="text-white text-2xl font-bold text-center mb-3">
              Erro na Análise
            </Text>
            <Text className="text-slate-400 text-center mb-8">{error}</Text>
            <Pressable
              onPress={() => navigation.goBack()}
              className="bg-emerald-500 px-8 py-4 rounded-2xl active:opacity-80"
            >
              <Text className="text-white font-bold text-lg">Tentar Novamente</Text>
            </Pressable>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-950">
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          {/* Preview da imagem */}
          <View className="w-64 h-64 rounded-3xl overflow-hidden mb-8 border-2 border-slate-700">
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/30" />
          </View>

          {/* Loading animation */}
          <View className="items-center">
            <ActivityIndicator size="large" color="#10b981" />
            <Text className="text-white text-xl font-bold mt-6 text-center">
              {status}
            </Text>
            <Text className="text-slate-400 text-center mt-2">
              Isso pode levar alguns segundos...
            </Text>
          </View>

          {/* Progress dots */}
          <View className="flex-row items-center justify-center mt-8 space-x-2">
            <View className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <View className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-75" />
            <View className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-150" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default AnalysisScreen;

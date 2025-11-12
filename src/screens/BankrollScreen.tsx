// Tela de Gerenciamento de Banca
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
import { Dimensions } from "react-native";
import { useBankrollStore } from "../state/bankrollStore";
import { useSettingsStore } from "../state/settingsStore";

const screenWidth = Dimensions.get("window").width;

export default function BankrollScreen() {
  const {
    initialBankroll,
    currentBankroll,
    dailyResults,
    setInitialBankroll,
    addLiveResult,
    getDailyResults,
    getTotalProfit,
  } = useBankrollStore();

  const { checkBankrollAlert, checkStopLoss, resetStopLoss, settings } = useSettingsStore();

  const [showInitialSetup, setShowInitialSetup] = useState(
    initialBankroll === 0
  );
  const [initialAmount, setInitialAmount] = useState("");
  const [profitAmount, setProfitAmount] = useState("");
  const [isProfit, setIsProfit] = useState(true); // true = lucro, false = perda
  const [selectedLive, setSelectedLive] = useState<"11h" | "15h" | "19h" | "Sozinho">("11h");
  const [showAddResult, setShowAddResult] = useState(false);
  const [showEditBankroll, setShowEditBankroll] = useState(false);
  const [editBankrollAmount, setEditBankrollAmount] = useState("");

  const handleSetInitial = () => {
    const amount = parseFloat(initialAmount);
    if (amount > 0) {
      setInitialBankroll(amount);
      setShowInitialSetup(false);
      setInitialAmount("");
    }
  };

  const handleAddResult = () => {
    const amount = parseFloat(profitAmount);
    if (!isNaN(amount) && amount !== 0) {
      const profit = isProfit ? amount : -amount;
      addLiveResult(selectedLive, profit);

      // Checa alertas
      checkBankrollAlert(currentBankroll, initialBankroll);

      // Checa stop loss se for perda
      if (profit < 0) {
        // Calcula perda do dia
        const today = new Date().toISOString().split("T")[0];
        const todayResult = dailyResults.find((r) => r.date.split("T")[0] === today);
        const dailyLoss = todayResult ? Math.abs(Math.min(0, todayResult.totalProfit)) : Math.abs(profit);
        checkStopLoss(dailyLoss);
      }

      setProfitAmount("");
      setIsProfit(true);
      setSelectedLive("11h");
      setShowAddResult(false);
    }
  };

  const handleEditBankroll = () => {
    const amount = parseFloat(editBankrollAmount);
    if (amount > 0) {
      setInitialBankroll(amount);
      setEditBankrollAmount("");
      setShowEditBankroll(false);
    }
  };

  const last30Days = getDailyResults(30);
  const totalProfit = getTotalProfit();
  const profitPercentage =
    initialBankroll > 0 ? (totalProfit / initialBankroll) * 100 : 0;

  if (showInitialSetup) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 px-6 justify-center">
              <View className="bg-slate-800 rounded-3xl p-6 border-2 border-slate-700">
                <View className="items-center mb-6">
                  <View className="w-20 h-20 bg-emerald-500/20 rounded-full items-center justify-center mb-4">
                    <Ionicons name="wallet" size={40} color="#10b981" />
                  </View>
                  <Text className="text-white text-2xl font-bold mb-2">
                    Configure sua Banca
                  </Text>
                  <Text className="text-slate-400 text-center">
                    Informe o valor inicial da sua banca para começar o
                    acompanhamento
                  </Text>
                </View>

                <View className="mb-6">
                  <Text className="text-slate-300 text-sm mb-2 font-medium">
                    Valor Inicial (R$)
                  </Text>
                  <TextInput
                    className="bg-slate-700 text-white text-2xl px-4 py-4 rounded-xl border-2 border-slate-600"
                    placeholder="1000.00"
                    placeholderTextColor="#64748b"
                    keyboardType="decimal-pad"
                    value={initialAmount}
                    onChangeText={setInitialAmount}
                  />
                </View>

                <Pressable
                  onPress={handleSetInitial}
                  className="bg-emerald-500 py-4 rounded-xl items-center active:opacity-70"
                  disabled={!initialAmount || parseFloat(initialAmount) <= 0}
                >
                  <Text className="text-white text-lg font-bold">
                    Começar Acompanhamento
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-900" edges={["top"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <Text className="text-white text-3xl font-bold mb-2">
            Gerenciamento de Banca
          </Text>
          <Text className="text-slate-400">
            Acompanhe sua evolução financeira
          </Text>
        </View>

        {/* Cards de Resumo */}
        <View className="px-6 mb-6">
          <View className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-6 border-2 border-purple-400 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-purple-200 text-sm">Banca Atual</Text>
              <Pressable
                onPress={() => {
                  setEditBankrollAmount(currentBankroll.toFixed(2));
                  setShowEditBankroll(true);
                }}
                className="bg-purple-500/30 px-3 py-1 rounded-full active:opacity-70"
              >
                <Text className="text-white text-xs font-bold">Editar</Text>
              </Pressable>
            </View>
            <View className="flex-row items-center">
              <Ionicons
                name="wallet"
                size={32}
                color="#c084fc"
                style={{ marginRight: 12 }}
              />
              <Text className="text-white text-4xl font-bold">
                R$ {currentBankroll.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-slate-800 rounded-2xl p-4 border-2 border-slate-700">
              <Text className="text-slate-400 text-xs mb-1">Inicial</Text>
              <Text className="text-white text-lg font-bold">
                R$ {initialBankroll.toFixed(2)}
              </Text>
            </View>

            <View className="flex-1 bg-slate-800 rounded-2xl p-4 border-2 border-slate-700">
              <Text className="text-slate-400 text-xs mb-1">Lucro Total</Text>
              <Text
                className={`text-lg font-bold ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                R$ {totalProfit >= 0 ? "+" : ""}
                {totalProfit.toFixed(2)}
              </Text>
            </View>

            <View className="flex-1 bg-slate-800 rounded-2xl p-4 border-2 border-slate-700">
              <Text className="text-slate-400 text-xs mb-1">Variação</Text>
              <Text
                className={`text-lg font-bold ${profitPercentage >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {profitPercentage >= 0 ? "+" : ""}
                {profitPercentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Gráfico Visual Simples */}
        {last30Days.length > 0 && (
          <View className="mb-6 px-6">
            <Text className="text-white text-xl font-bold mb-4">
              Evolução (Últimos 7 dias)
            </Text>
            <View className="bg-slate-800 rounded-2xl p-4 border-2 border-slate-700">
              <View className="flex-row items-end h-40 justify-around">
                {last30Days.slice(-7).map((result, index) => {
                  const maxValue = Math.max(
                    ...last30Days.slice(-7).map((r) => r.bankrollAfter)
                  );
                  const height = (result.bankrollAfter / maxValue) * 100;
                  const date = new Date(result.date);

                  return (
                    <View key={index} className="flex-1 items-center">
                      <View
                        style={{ height: `${height}%` }}
                        className="w-8 bg-emerald-500 rounded-t-lg"
                      />
                      <Text className="text-slate-400 text-xs mt-2">
                        {date.getDate()}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Histórico */}
        <View className="px-6 mb-6">
          <Text className="text-white text-xl font-bold mb-4">
            Histórico (Últimos 30 dias)
          </Text>

          {last30Days.length === 0 ? (
            <View className="bg-slate-800 rounded-2xl p-6 border-2 border-slate-700 items-center">
              <Ionicons
                name="calendar-outline"
                size={40}
                color="#64748b"
                style={{ marginBottom: 8 }}
              />
              <Text className="text-slate-400 text-center">
                Nenhum resultado registrado ainda.{"\n"}Adicione seu primeiro
                resultado!
              </Text>
            </View>
          ) : (
            <View className="space-y-2">
              {last30Days.reverse().map((result, index) => {
                const date = new Date(result.date);
                const isToday =
                  date.toISOString().split("T")[0] ===
                  new Date().toISOString().split("T")[0];

                // Compatibilidade com estrutura antiga (sem lives)
                const lives = result.lives || [];
                const totalProfit = result.totalProfit || 0;

                return (
                  <View
                    key={index}
                    className="bg-slate-800 rounded-2xl p-4 border-2 border-slate-700 mb-3"
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-white font-bold text-base mb-1">
                          {isToday
                            ? "Hoje"
                            : date.toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                              })}
                        </Text>
                        <Text className="text-slate-400 text-xs mb-2">
                          Banca: R$ {result.bankrollAfter.toFixed(2)}
                        </Text>

                        {/* Lives do dia */}
                        {lives.length > 0 && (
                          <View className="space-y-1">
                            {lives.map((live, liveIndex) => (
                              <View
                                key={liveIndex}
                                className="flex-row items-center"
                              >
                                <View
                                  className={`px-2 py-0.5 rounded ${
                                    live.time === "11h"
                                      ? "bg-blue-500/20"
                                      : live.time === "15h"
                                        ? "bg-purple-500/20"
                                        : live.time === "19h"
                                          ? "bg-amber-500/20"
                                          : "bg-slate-500/20"
                                  }`}
                                >
                                  <Text
                                    className={`text-xs font-bold ${
                                      live.time === "11h"
                                        ? "text-blue-400"
                                        : live.time === "15h"
                                          ? "text-purple-400"
                                          : live.time === "19h"
                                            ? "text-amber-400"
                                            : "text-slate-300"
                                    }`}
                                  >
                                    {live.time}
                                  </Text>
                                </View>
                                <Text
                                  className={`text-xs ml-2 ${
                                    live.profit >= 0
                                      ? "text-emerald-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {live.profit >= 0 ? "+" : ""}R${" "}
                                  {live.profit.toFixed(2)}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>

                      <View className="items-end">
                        <Text className="text-slate-400 text-xs mb-1">
                          Total
                        </Text>
                        <Text
                          className={`text-xl font-bold ${totalProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {totalProfit >= 0 ? "+" : ""}R${" "}
                          {totalProfit.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Botão Flutuante */}
      <View className="absolute bottom-6 right-6">
        <Pressable
          onPress={() => setShowAddResult(true)}
          className="w-16 h-16 bg-emerald-500 rounded-full items-center justify-center active:opacity-70 shadow-lg"
        >
          <Ionicons name="add" size={32} color="white" />
        </Pressable>
      </View>

      {/* Modal para adicionar resultado */}
      {showAddResult && (
        <View className="absolute inset-0 bg-black/70 justify-center items-center">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="bg-slate-800 rounded-3xl p-6 mx-6 border-2 border-slate-700 w-80">
                <Text className="text-white text-2xl font-bold mb-4">
                  Adicionar Resultado
                </Text>

                <Text className="text-slate-400 text-sm mb-3">
                  Escolha a live
                </Text>

                {/* Botões de Lives */}
                <View className="flex-row gap-2 mb-4">
                  <Pressable
                    onPress={() => setSelectedLive("11h")}
                    className={`flex-1 py-2 rounded-xl items-center border-2 ${
                      selectedLive === "11h"
                        ? "bg-blue-500 border-blue-400"
                        : "bg-slate-700 border-slate-600"
                    }`}
                  >
                    <Text className="text-white font-bold text-sm">11h</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setSelectedLive("15h")}
                    className={`flex-1 py-2 rounded-xl items-center border-2 ${
                      selectedLive === "15h"
                        ? "bg-purple-500 border-purple-400"
                        : "bg-slate-700 border-slate-600"
                    }`}
                  >
                    <Text className="text-white font-bold text-sm">15h</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setSelectedLive("19h")}
                    className={`flex-1 py-2 rounded-xl items-center border-2 ${
                      selectedLive === "19h"
                        ? "bg-amber-500 border-amber-400"
                        : "bg-slate-700 border-slate-600"
                    }`}
                  >
                    <Text className="text-white font-bold text-sm">19h</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setSelectedLive("Sozinho")}
                    className={`flex-1 py-2 rounded-xl items-center border-2 ${
                      selectedLive === "Sozinho"
                        ? "bg-slate-400 border-slate-300"
                        : "bg-slate-700 border-slate-600"
                    }`}
                  >
                    <Text className="text-white font-bold text-xs">Sozinho</Text>
                  </Pressable>
                </View>

                <Text className="text-slate-400 text-sm mb-3">
                  Escolha o tipo de resultado
                </Text>

                {/* Botões de Lucro/Perda */}
                <View className="flex-row gap-3 mb-4">
                  <Pressable
                    onPress={() => setIsProfit(true)}
                    className={`flex-1 py-3 rounded-xl items-center border-2 ${
                      isProfit
                        ? "bg-emerald-500 border-emerald-400"
                        : "bg-slate-700 border-slate-600"
                    }`}
                  >
                    <Ionicons
                      name="trending-up"
                      size={20}
                      color="white"
                      style={{ marginBottom: 4 }}
                    />
                    <Text className="text-white font-bold text-sm">Lucro</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setIsProfit(false)}
                    className={`flex-1 py-3 rounded-xl items-center border-2 ${
                      !isProfit
                        ? "bg-red-500 border-red-400"
                        : "bg-slate-700 border-slate-600"
                    }`}
                  >
                    <Ionicons
                      name="trending-down"
                      size={20}
                      color="white"
                      style={{ marginBottom: 4 }}
                    />
                    <Text className="text-white font-bold text-sm">Perda</Text>
                  </Pressable>
                </View>

                <Text className="text-slate-400 text-sm mb-2">
                  Valor (R$)
                </Text>

                <TextInput
                  className="bg-slate-700 text-white text-2xl px-4 py-4 rounded-xl border-2 border-slate-600 mb-6"
                  placeholder="100.00"
                  placeholderTextColor="#64748b"
                  keyboardType="decimal-pad"
                  value={profitAmount}
                  onChangeText={setProfitAmount}
                />

                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => {
                      setShowAddResult(false);
                      setProfitAmount("");
                      setIsProfit(true);
                      setSelectedLive("11h");
                    }}
                    className="flex-1 bg-slate-700 py-3 rounded-xl items-center active:opacity-70"
                  >
                    <Text className="text-white font-bold">Cancelar</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleAddResult}
                    className={`flex-1 py-3 rounded-xl items-center active:opacity-70 ${
                      isProfit ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    <Text className="text-white font-bold">Adicionar</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      )}

      {/* Modal para editar banca */}
      {showEditBankroll && (
        <View className="absolute inset-0 bg-black/70 justify-center items-center">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="bg-slate-800 rounded-3xl p-6 mx-6 border-2 border-purple-500 w-80">
                <View className="items-center mb-4">
                  <View className="w-16 h-16 bg-purple-500/20 rounded-full items-center justify-center mb-3">
                    <Ionicons name="wallet" size={32} color="#a855f7" />
                  </View>
                  <Text className="text-white text-2xl font-bold">
                    Editar Banca
                  </Text>
                </View>

                <Text className="text-slate-400 text-sm mb-2">
                  Novo valor da banca (R$)
                </Text>

                <TextInput
                  className="bg-slate-700 text-white text-2xl px-4 py-4 rounded-xl border-2 border-slate-600 mb-2"
                  placeholder="1000.00"
                  placeholderTextColor="#64748b"
                  keyboardType="decimal-pad"
                  value={editBankrollAmount}
                  onChangeText={setEditBankrollAmount}
                />

                <Text className="text-amber-400 text-xs mb-6">
                  ⚠️ Isso irá redefinir sua banca. Use para correções ou ajustes manuais.
                </Text>

                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => {
                      setShowEditBankroll(false);
                      setEditBankrollAmount("");
                    }}
                    className="flex-1 bg-slate-700 py-3 rounded-xl items-center active:opacity-70"
                  >
                    <Text className="text-white font-bold">Cancelar</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleEditBankroll}
                    className="flex-1 bg-purple-500 py-3 rounded-xl items-center active:opacity-70"
                  >
                    <Text className="text-white font-bold">Salvar</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      )}
    </SafeAreaView>
  );
}

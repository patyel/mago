// Tela de Conquistas
import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useStatsStore } from "../state/statsStore";

type AchievementsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Achievements">;
};

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ navigation }) => {
  const { achievements } = useStatsStore();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

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
                <Text className="text-white text-2xl font-bold">Conquistas</Text>
                <View className="w-12 h-12" />
              </View>

              {/* Progress */}
              <View className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-6 mb-6 border-2 border-purple-400">
                <Text className="text-white text-4xl font-black mb-2">
                  {unlockedCount}/{achievements.length}
                </Text>
                <Text className="text-purple-200 text-base">
                  Conquistas Desbloqueadas
                </Text>
              </View>

              {/* Achievements List */}
              <View className="space-y-4">
                {achievements.map((achievement) => (
                  <View
                    key={achievement.id}
                    className={`${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-500/50"
                        : "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700"
                    } rounded-3xl p-5 border-2`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-16 h-16 rounded-2xl items-center justify-center mr-4 ${
                          achievement.unlocked ? "bg-green-500" : "bg-slate-700"
                        }`}
                      >
                        <Ionicons
                          name={achievement.icon as any}
                          size={32}
                          color="white"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-lg mb-1">
                          {achievement.title}
                        </Text>
                        <Text
                          className={`text-sm ${
                            achievement.unlocked
                              ? "text-green-300"
                              : "text-slate-400"
                          }`}
                        >
                          {achievement.description}
                        </Text>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <Text className="text-green-400 text-xs mt-2">
                            ✓ Desbloqueado em{" "}
                            {new Date(achievement.unlockedAt).toLocaleDateString("pt-BR")}
                          </Text>
                        )}
                        {!achievement.unlocked && (
                          <View className="mt-2 bg-slate-700/50 rounded-full px-3 py-1 self-start">
                            <Text className="text-slate-400 text-xs font-bold">
                              🔒 Bloqueado
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default AchievementsScreen;

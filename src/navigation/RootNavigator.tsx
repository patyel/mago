// Navegação principal do app
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RouletteAnalysis } from "../types/roulette";
import { useAccessCodeStore } from "../state/accessCodeStore";

// Importar screens
import OnboardingScreen from "../screens/OnboardingScreen";
import ActivationScreen from "../screens/ActivationScreen";
import ImagePickerScreen from "../screens/ImagePickerScreen";
import AnalysisScreen from "../screens/AnalysisScreen";
import ResultsScreen from "../screens/ResultsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import StatsScreen from "../screens/StatsScreen";
import AchievementsScreen from "../screens/AchievementsScreen";
import { MainTabs } from "./MainTabs";

export type RootStackParamList = {
  Onboarding: undefined;
  Activation: undefined;
  MainTabs: undefined;
  Camera: undefined;
  Analysis: { imageUri: string };
  Results: { analysis: RouletteAnalysis; fromHistory?: boolean };
  History: undefined;
  Stats: undefined;
  Achievements: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const isActive = useAccessCodeStore((s) => s.isActive);
  const hasCompletedOnboarding = useAccessCodeStore((s) => s.codigo !== null);

  return (
    <Stack.Navigator
      initialRouteName={
        hasCompletedOnboarding
          ? isActive
            ? "MainTabs"
            : "Activation"
          : "Onboarding"
      }
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Activation" component={ActivationScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Camera" component={ImagePickerScreen} />
      <Stack.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{ animation: "fade" }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
    </Stack.Navigator>
  );
};

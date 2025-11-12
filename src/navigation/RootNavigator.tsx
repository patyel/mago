// Navegação principal do app
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RouletteAnalysis } from "../types/roulette";

// Importar screens (vamos criar)
import OnboardingScreen from "../screens/OnboardingScreen";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import AnalysisScreen from "../screens/AnalysisScreen";
import ResultsScreen from "../screens/ResultsScreen";
import HistoryScreen from "../screens/HistoryScreen";

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  Camera: undefined;
  Analysis: { imageUri: string };
  Results: { analysis: RouletteAnalysis };
  History: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
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
    </Stack.Navigator>
  );
};

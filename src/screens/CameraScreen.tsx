// Tela da Câmera
import React, { useState, useRef } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

type CameraScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Camera">;
};

const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View className="flex-1 bg-slate-950" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center px-6">
        <Ionicons name="camera-outline" size={64} color="#94a3b8" />
        <Text className="text-white text-xl font-bold mt-4 text-center">
          Permissão de Câmera Necessária
        </Text>
        <Text className="text-slate-400 text-center mt-2 mb-8">
          Precisamos acessar sua câmera para analisar a mesa de roleta
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-emerald-500 px-8 py-4 rounded-2xl active:opacity-80"
        >
          <Text className="text-white font-bold text-lg">Permitir Câmera</Text>
        </Pressable>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => !current);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      // @ts-ignore - takePicture exists but type definitions are incomplete
      const photo = await cameraRef.current.takePicture({
        quality: 0.8,
      });

      if (photo?.uri) {
        // Salva temporariamente
        const fileName = `roulette_${Date.now()}.jpg`;
        const newPath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.copyAsync({
          from: photo.uri,
          to: newPath,
        });

        navigation.navigate("Analysis", { imageUri: newPath });
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Erro", "Não foi possível tirar a foto");
    }
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        enableTorch={flash}
      >
        {/* Overlay UI */}
        <View className="absolute top-0 left-0 right-0 bottom-0 z-10">
          <SafeAreaView className="flex-1">
            {/* Top Bar */}
            <View className="flex-row items-center justify-between px-6 mb-4">
              <Pressable
                onPress={() => navigation.goBack()}
                className="w-12 h-12 bg-black/50 rounded-full items-center justify-center active:opacity-70"
              >
                <Ionicons name="close" size={28} color="white" />
              </Pressable>

              <Text className="text-white font-bold text-lg">
                Fotografe o Painel
              </Text>

              <Pressable
                onPress={toggleFlash}
                className="w-12 h-12 bg-black/50 rounded-full items-center justify-center active:opacity-70"
              >
                <Ionicons
                  name={flash ? "flash" : "flash-off"}
                  size={24}
                  color="white"
                />
              </Pressable>
            </View>

            {/* Center Guide */}
            <View className="flex-1 items-center justify-center px-6">
              <View className="border-2 border-white/50 border-dashed rounded-3xl w-full aspect-[4/3] items-center justify-center">
                <Ionicons name="grid-outline" size={64} color="rgba(255,255,255,0.3)" />
                <Text className="text-white text-center mt-4 px-4">
                  Centralize o painel da roleta{"\n"}com os últimos resultados
                </Text>
              </View>
            </View>

            {/* Bottom Bar */}
            <View className="px-6 pb-8">
              <View className="flex-row items-center justify-between">
                {/* Flip Camera */}
                <Pressable
                  onPress={toggleCameraFacing}
                  className="w-14 h-14 bg-black/50 rounded-full items-center justify-center active:opacity-70"
                >
                  <Ionicons name="camera-reverse" size={28} color="white" />
                </Pressable>

                {/* Capture Button */}
                <Pressable
                  onPress={takePicture}
                  className="w-20 h-20 border-4 border-white rounded-full items-center justify-center active:scale-95"
                >
                  <View className="w-16 h-16 bg-white rounded-full" />
                </Pressable>

                {/* Spacer */}
                <View className="w-14 h-14" />
              </View>

              {/* Helper Text */}
              <Text className="text-white/70 text-center mt-6 text-sm">
                Certifique-se que os números estão visíveis e legíveis
              </Text>
            </View>
          </SafeAreaView>
        </View>
      </CameraView>
    </View>
  );
};

export default CameraScreen;

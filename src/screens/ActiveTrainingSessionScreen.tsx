import { View, Text } from "react-native";
import useActiveTrainingSessionStore from "../store/useActiveTrainingSessionStore";
import { useEffect, useState } from "react";
import { APIGainstrackTrainingSessionDetailResponse } from "../types/trainingSession.types";

export default function ActiveTrainingSessionScreen({
  route,
  navigation,
}: any) {
  const { activeTrainingSession, startTimestamp, clearTrainingSession } =
    useActiveTrainingSessionStore();

  const [trainingSession, setTrainingSession] =
    useState<APIGainstrackTrainingSessionDetailResponse | null>();

  // Variable para timmer en pantalla
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    console.log("INICIO SCREEN ACTIVE TRAINING SESSION");
    setTrainingSession(activeTrainingSession);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp!) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval); // limpieza al desmontar
  }, []);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View>
      <Text>
        Sesión de entrenamiento. Notas: {activeTrainingSession?.notes}, Hora
        inicio: {startTimestamp}
      </Text>
      <Text>{formatTime(elapsedSeconds)}</Text>
    </View>
  );
}

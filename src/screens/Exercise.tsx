import { useEffect, useState } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import {
  VStack,
  Text,
  Icon,
  HStack,
  Heading,
  Image,
  Box,
  useToast,
} from "@gluestack-ui/themed";

import { ArrowLeft } from "lucide-react-native";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { useNavigation, useRoute } from "@react-navigation/native";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionSvg from "@assets/repetitions.svg";

import { Button } from "@components/Button";
import { Loading } from "@components/Loading";
import { ToastMessage } from "@components/ToastMessage";

import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

type RouteParamsProps = {
  exerciseId: string;
};

export function Exercise() {
  const [sendingRegister, setSendingRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const route = useRoute();
  const toast = useToast();

  const { exerciseId } = route.params as RouteParamsProps;

  function handleGoBack() {
    navigation.goBack();
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os detalhes do exercício.";

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true);
      await api.post(`/history`, { exercise_id: exerciseId });
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="success"
            title={"Parabéns! Exercício registrado no seu histórico"}
            onClose={() => toast.close(id)}
          />
        ),
      });

      navigation.navigate("history");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível registrar a execução do exercício.";

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      });
    } finally {
      setSendingRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <VStack>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            <VStack px="$8" mt="$6">
              <Box rounded="$lg" mb="$3" overflow="hidden">
                <Image
                  source={{
                    uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
                  }}
                  alt="Imagem do exercício"
                  resizeMode="cover"
                  w="$full"
                  h="$80"
                />
              </Box>

              <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
                <HStack
                  alignItems="center"
                  justifyContent="space-around"
                  mb="$6"
                  mt="$5"
                >
                  <HStack>
                    <SeriesSvg />
                    <Text color="$gray200" ml="$2">
                      {exercise.series} séries
                    </Text>
                  </HStack>
                  <HStack>
                    <RepetitionSvg />
                    <Text color="$gray200" ml="$2">
                      {exercise.repetitions} repetições
                    </Text>
                  </HStack>
                </HStack>
                <Button
                  title="Marcar como realizado"
                  isLoading={sendingRegister}
                  isDisabled={sendingRegister}
                  onPress={handleExerciseHistoryRegister}
                />
              </Box>
            </VStack>
          </ScrollView>
        </VStack>
      )}
    </VStack>
  );
}

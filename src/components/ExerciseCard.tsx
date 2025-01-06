import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import {
  Image,
  HStack,
  VStack,
  Heading,
  Text,
  Icon,
} from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";

type Props = TouchableOpacityProps & {};

export function ExerciseCard({ ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="$gray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: "https://oestesom.vteximg.com.br/arquivos/ids/178208-425-425/barra-fixa-de-parede-crossfit-pull-up-treino-musculaco-D_NQ_NP_677572-MLB41374140786_042020-F.jpg?v=637273144409830000",
          }}
          alt="Imagem do exercício"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            Puxada frontal
          </Heading>
          <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={3}>
            3 séries x 12 repetições
          </Text>
        </VStack>
        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  );
}

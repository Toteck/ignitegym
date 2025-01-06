import { ScrollView } from "react-native";
import { ScreenHeader } from "@components/ScreenHeader";
import { VStack, Text, Center } from "@gluestack-ui/themed";
import { UserPhoto } from "@components/UserPhoto";

export function Profile() {
  return (
    <VStack>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: "https:github.com/toteck.png" }}
            alt="Foto do usuário"
            size="xl"
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}

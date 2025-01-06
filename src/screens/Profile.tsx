import { ScrollView, TouchableOpacity } from "react-native";
import { ScreenHeader } from "@components/ScreenHeader";
import { VStack, Text, Center } from "@gluestack-ui/themed";

import { Input } from "@components/Input";
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
          <TouchableOpacity>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$4"
              mb="$8"
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Center w="$full" gap="$4">
            <Input placeholder="Nome" bg="$gray600" />
            <Input
              value="mateusweslley@acad.ifma.edu.br"
              bg="$gray600"
              isReadOnly
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}

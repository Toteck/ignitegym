import { useState } from "react";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import { ScreenHeader } from "@components/ScreenHeader";
import { VStack, Text, Center, Heading } from "@gluestack-ui/themed";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { Input } from "@components/Input";
import { UserPhoto } from "@components/UserPhoto";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";

export function Profile() {
  const [userPhoto, setUserPhoto] = useState("https:github.com/toteck.png");

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoUri = photoSelected.assets[0].uri;

      if (photoUri) {
        const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
          size: number;
        };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return Alert.alert(
            "Essa imagem é muito grande.\nEscolha uma imagem de até 5MB."
          );
        }

        setUserPhoto(photoUri);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <VStack>
      <ScreenHeader title="Perfil" />

      <ToastMessage
        id="1"
        title="Mesagem de exemplo"
        description="Descrição de exemplo exemplar exemplificando o exemplo"
        action="success"
        onClose={() => {}}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: userPhoto }}
            alt="Foto do usuário"
            size="xl"
          />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$4"
              mb="$8"
            >
              Alterar fotos
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
          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry />
            <Input placeholder="Nova senha" bg="$gray600" secureTextEntry />
            <Input
              placeholder="Confirme a nova senha"
              bg="$gray600"
              secureTextEntry
            />

            <Button title="Atualizar" />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}

import React, { useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { globalStyles } from "../styles/globalStyles";
import { AIAssistant } from "../styles/AIAssistant";

type ChoosePersonaScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ChoosePersonaScreen = () => {
  const navigation = useNavigation<ChoosePersonaScreenNavigationProp>();

  return (
    <View style={globalStyles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/gradient_bg_2.png")}
        style={AIAssistant.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            >
        <View style={AIAssistant.overlay}>

        <View style={AIAssistant.titleContainer}>
            <Text style={AIAssistant.title}>Choose your</Text>
            <Text style={AIAssistant.title}>Persona</Text>
        </View>

          <View style={[AIAssistant.logoSection, AIAssistant.chossePersonaCarousel]}>
            <Image
              source={require("../../assets/persona.png")}
              style={{  width: 163, height: 163 }}
              resizeMode="contain"
            />
            <View>
                <Text style={AIAssistant.logoText}>Lena Vale</Text>
                <Text style={AIAssistant.logoSubText}>The Mindful Explorer</Text>
            </View>
          </View>
   

          <View style={AIAssistant.buttonContainer}>
            <TouchableOpacity style={[AIAssistant.aiButtons, AIAssistant.letsGo]}>
              <Text style={[AIAssistant.aiButtonText, AIAssistant.letsGoText]}>
                Let's go
              </Text>
            </TouchableOpacity>
          </View>

        </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ChoosePersonaScreen;
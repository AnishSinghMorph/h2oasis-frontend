import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { AIAssistant } from "../styles/AIAssistant";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type AIAssistantScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const AIAssistantScreen = () => {
  const navigation = useNavigation<AIAssistantScreenNavigationProp>();

  return (
    <View style={globalStyles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require("../../assets/gradient_bg_1.png")}
        style={AIAssistant.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View style={AIAssistant.overlay}>
            <View style={AIAssistant.logoSection}>
              <Image
                source={require("../../assets/evy.png")}
                style={AIAssistant.logo}
                resizeMode="contain"
              />
              <Text style={AIAssistant.logoText}>Hi I am Evy!</Text>
              <Text style={AIAssistant.logoText}>Your own AI assistant</Text>
              <Text style={AIAssistant.logoSubText}>
                Let’s start the journey together
              </Text>
            </View>

            <View style={AIAssistant.buttonContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("choosePersona")}
                style={[AIAssistant.aiButtons, AIAssistant.selectPersona]}
              >
                <Text
                  style={[
                    AIAssistant.aiButtonText,
                    AIAssistant.selectPersonaText,
                  ]}
                >
                  Select Persona
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[AIAssistant.aiButtons, AIAssistant.letsGo]}
              >
                <Text
                  style={[AIAssistant.aiButtonText, AIAssistant.letsGoText]}
                >
                  Let&apos;s go
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default AIAssistantScreen;

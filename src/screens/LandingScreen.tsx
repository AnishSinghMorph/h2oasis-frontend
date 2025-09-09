import React from 'react';
import { View, Text, Image, ImageBackground, StatusBar } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { landingStyles } from '../styles/LandingScreenStyles';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

const LandingScreen = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('SignUp');
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../assets/person.png')}
        style={landingStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={landingStyles.overlay}>
          <View style={landingStyles.logoSection}>
            <Image
              source={require('../../assets/logo.png')}
              style={landingStyles.logo}
              resizeMode="contain"
            />
            <Text style={landingStyles.logoText}>H2OASIS</Text>
          </View>
          <View style={landingStyles.contentSection}>
            <Text style={landingStyles.welcomeText}>Welcome to H2Oasis!</Text>
            <Text style={landingStyles.taglineText}>Elevating Escape—</Text>
            <Text style={landingStyles.taglineText}>One Breath, One Moment,</Text>
            <Text style={landingStyles.taglineText}>One Immersion at a Time</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LandingScreen;

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { signUpStyles } from '../styles/SignUpScreenStyles';
import API_CONFIG from '../config/api';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  
  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  // Handle sign up
  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Call your backend API using config
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to create account');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={signUpStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View style={signUpStyles.content}>
            
            {/* Title */}
            <Text style={signUpStyles.title}>Create an account</Text>
            <Text style={signUpStyles.subtitle}>
              Create your account, it takes less than a minute.{'\n'}
              Enter your email/phone and password
            </Text>

            {/* Form Inputs */}
            <View style={signUpStyles.inputContainer}>
              <TextInput
                style={signUpStyles.input}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="First Name"
                placeholderTextColor="#999999"
                autoCapitalize="words"
              />
            </View>

            <View style={signUpStyles.inputContainer}>
              <TextInput
                style={signUpStyles.input}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Last Name"
                placeholderTextColor="#999999"
                autoCapitalize="words"
              />
            </View>

            <View style={signUpStyles.inputContainer}>
              <TextInput
                style={signUpStyles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Email /Phone"
                placeholderTextColor="#999999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={signUpStyles.inputContainer}>
              <TextInput
                style={signUpStyles.input}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Password"
                placeholderTextColor="#999999"
                secureTextEntry
              />
            </View>

            <View style={signUpStyles.inputContainer}>
              <TextInput
                style={signUpStyles.input}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Re-enter password"
                placeholderTextColor="#999999"
                secureTextEntry
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={signUpStyles.signUpButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={signUpStyles.signUpButtonText}>
                {loading ? 'Creating Account...' : 'Create an Account'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={signUpStyles.orContainer}>
              <View style={signUpStyles.orLine} />
              <Text style={signUpStyles.orText}>or</Text>
              <View style={signUpStyles.orLine} />
            </View>
            
            {/* Social Login Buttons */}
            <TouchableOpacity style={signUpStyles.socialButton}>
              <Image 
                source={require('../../assets/apple.png')} 
                style={{ width: 20, height: 20, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text style={signUpStyles.socialButtonText}>Sign in with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[signUpStyles.socialButton, signUpStyles.googleButton]}>
              <Image 
                source={require('../../assets/google.png')} 
                style={{ width: 20, height: 20, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text style={signUpStyles.socialButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={signUpStyles.loginLink}>
              <Text style={signUpStyles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={signUpStyles.loginLinkText}>Log in</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
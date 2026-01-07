import React, { useMemo } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { wp, hp, fontScale } from "../../utils/responsive";

interface EmailPhoneInputProps
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (value: string) => void;
  countryCode?: string;
  countryFlag?: string;
  onCountryPress?: () => void;
  error?: string;
  containerStyle?: object;
}

// Helper function to detect if input looks like a phone number
const isPhoneNumber = (value: string): boolean => {
  if (!value) return false;
  // Remove spaces and check if it starts with digits or + followed by digits
  const cleaned = value.replace(/\s/g, "");
  // Phone number pattern: starts with digit(s) or + followed by digits
  // If it contains @ it's definitely email
  if (cleaned.includes("@")) return false;
  // Check if it's predominantly numbers (allowing for some formatting characters)
  const digitsOnly = cleaned.replace(/[^0-9]/g, "");
  // If user typed at least 1 digit and the input is mostly digits, show phone picker
  return digitsOnly.length > 0 && digitsOnly.length >= cleaned.length * 0.5;
};

export const EmailPhoneInput: React.FC<EmailPhoneInputProps> = ({
  value,
  onChangeText,
  countryCode = "+32",
  countryFlag = "🇧🇪",
  onCountryPress,
  error,
  containerStyle,
  ...props
}) => {
  // Determine if we should show the country picker based on input
  const showCountryPicker = useMemo(() => isPhoneNumber(value), [value]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {/* Country Code Picker - Only show when phone number detected */}
        {showCountryPicker && (
          <>
            <TouchableOpacity
              style={styles.countryPicker}
              onPress={onCountryPress}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{countryFlag}</Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider} />
          </>
        )}

        {/* Email/Phone Input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Email / Phone"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={showCountryPicker ? "phone-pad" : "email-address"}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(16),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(94, 94, 94, 0.28)",
    borderRadius: wp(16),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: wp(16),
    height: hp(56),
  },
  inputError: {
    borderColor: "#FF6B6B",
  },
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: wp(12),
  },
  flag: {
    fontSize: fontScale(24),
    marginRight: wp(6),
  },
  divider: {
    width: 1,
    height: hp(28),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginRight: wp(12),
  },
  input: {
    flex: 1,
    fontSize: fontScale(16),
    color: "#FFFFFF",
    height: "100%",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: fontScale(12),
    marginTop: hp(6),
    marginLeft: wp(4),
  },
});

export default EmailPhoneInput;

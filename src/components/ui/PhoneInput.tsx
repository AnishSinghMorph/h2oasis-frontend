import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { wp, hp, fontScale } from "../../utils/responsive";

interface PhoneInputProps
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (value: string) => void;
  countryCode?: string;
  countryFlag?: string;
  onCountryPress?: () => void;
  isValid?: boolean;
  error?: string;
  containerStyle?: object;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  countryCode = "+1",
  countryFlag = "🇺🇸",
  onCountryPress,
  isValid = false,
  error,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {/* Country Code Picker */}
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

        {/* Country Code Display */}
        <Text style={styles.countryCodeText}>{countryCode}</Text>

        {/* Phone Number Input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="12 34 56 78"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          keyboardType="phone-pad"
          {...props}
        />

        {/* Valid Checkmark */}
        {isValid && (
          <View style={styles.checkmark}>
            <Ionicons name="checkmark" size={18} color="#1A1A1A" />
          </View>
        )}
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
  countryCodeText: {
    fontSize: fontScale(16),
    color: "#FFFFFF",
    marginRight: wp(8),
  },
  input: {
    flex: 1,
    fontSize: fontScale(16),
    color: "#FFFFFF",
    height: "100%",
  },
  checkmark: {
    width: wp(28),
    height: wp(28),
    borderRadius: wp(14),
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(8),
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: fontScale(12),
    marginTop: hp(6),
    marginLeft: wp(4),
  },
});

export default PhoneInput;

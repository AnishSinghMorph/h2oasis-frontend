import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SelectProductStyles } from "../styles/SelectProductStyles";
import { RootStackParamList } from "../navigation/AppNavigator";
import { progressBarStyles } from "../styles/ProgressBar";
import { useSetupProgress } from "../context/SetupProgressContext";
import { NextButton } from "../components/NextButton";

const SelectProductScreen = () => {
  type Product = {
    id: string;
    name: string;
    icon: any;
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const {
    currentStep,
    totalSteps,
    stepProgress,
    updateStepProgress,
    updateCurrentStep,
    getProgressPercentage,
  } = useSetupProgress();

  // Set initial step when component mounts
  useEffect(() => {
    updateCurrentStep(1);
  }, []);

  const products: Product[] = [
    {
      id: "Cold Plunge",
      name: "Cold Plunge",
      icon: require("../../assets/icons/cold_plunge.png"),
    },
    {
      id: "Hot Tub",
      name: "Hot Tub",
      icon: require("../../assets/icons/hot_tub.png"),
    },
    {
      id: "Sauna",
      name: "Sauna",
      icon: require("../../assets/icons/sauna.png"),
    },
  ];

  return (
    <View style={SelectProductStyles.container}>
      {/* Content */}
      {/* Header with back button and progress */}
      <View style={SelectProductStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../../assets/back.png")}
            style={{ width: 12 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Progress bar */}
        <View style={progressBarStyles.container}>
          <View style={progressBarStyles.base}>
            <View
              style={[
                progressBarStyles.fill,
                { width: `${getProgressPercentage()}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Title */}
      <Text style={SelectProductStyles.title}>Select your product</Text>

      {/* Product Options */}
      <View style={SelectProductStyles.productOptions}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            onPress={() => {
              setSelectedProduct(product.id);
              updateStepProgress(1);
            }}
            style={[
              SelectProductStyles.productButton,
              selectedProduct === product.id
                ? SelectProductStyles.productButtonSelected
                : SelectProductStyles.productButtonUnselected,
            ]}
          >
            <View style={SelectProductStyles.productIconContainer}>
              <Image
                source={product.icon}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              />
            </View>
            <Text
              style={[
                SelectProductStyles.productName,
                selectedProduct === product.id
                  ? SelectProductStyles.productNameSelected
                  : SelectProductStyles.productNameUnselected,
              ]}
            >
              {product.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next Button */}
      <NextButton
        onPress={() => {
          if (selectedProduct) {
            navigation.navigate("ConeectWearables");
          }
        }}
        disabled={!selectedProduct}
      />
    </View>
  );
};

export default SelectProductScreen;

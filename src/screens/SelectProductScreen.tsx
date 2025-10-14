import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SelectProductStyles } from "../styles/SelectProductStyles";
import { RootStackParamList } from "../navigation/AppNavigator";
import { progressBarStyles } from "../styles/ProgressBar";
import { useSetupProgress } from "../context/SetupProgressContext";
import { useAuth } from "../context/AuthContext";
import { NextButton } from "../components/NextButton";
import API_CONFIG from "../config/api";

const SelectProductScreen = () => {
  type Product = {
    _id: string;
    name: string;
    type: string;
    isActive: boolean;
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setCurrentSelection] = useState<any>(null); // Store user's current selection (used for pre-selecting)

  // 🎯 Get the Firebase UID from our AuthContext
  const { firebaseUID } = useAuth();

  const { updateStepProgress, updateCurrentStep, getProgressPercentage } =
    useSetupProgress();

  // 🆕 Fetch user's current selection
  const fetchUserSelection = useCallback(async () => {
    if (!firebaseUID) return;

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MY_SELECTION}`,
        {
          headers: {
            "x-firebase-uid": firebaseUID,
          },
        },
      );

      const data = await response.json();

      if (response.ok && data.selection) {
        setCurrentSelection(data.selection);
        setSelectedProduct(data.selection.productId._id); // Pre-select their current choice
      } else {
        setCurrentSelection(null);
      }
    } catch (error) {
      console.error("❌ Error fetching user selection:", error);
    }
  }, [firebaseUID]);

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`,
      );
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
      } else {
        Alert.alert("Error", "Failed to load products");
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  }, []);

  // Set initial step when component mounts
  useEffect(() => {
    updateCurrentStep(1);
    fetchProducts();
    fetchUserSelection(); // 🆕 Load user's current selection
  }, [updateCurrentStep, fetchProducts, fetchUserSelection]);

  // 🚀 Handle product selection API call
  const handleSelectProduct = async () => {
    if (!selectedProduct) {
      Alert.alert("Error", "Please select a product first");
      return;
    }

    if (!firebaseUID) {
      Alert.alert("Error", "Authentication required. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SELECT_PRODUCT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-firebase-uid": firebaseUID, // 🎯 Use UID from AuthContext
          },
          body: JSON.stringify({
            productId: selectedProduct,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setCurrentSelection(data.selection); // Update current selection
        navigation.navigate("ConeectWearables");
      } else {
        Alert.alert("Error", data.message || "Failed to select product");
      }
    } catch (error) {
      console.error("❌ Error selecting product:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get icon for product type
  const getProductIcon = (type: string) => {
    switch (type) {
      case "cold-plunge":
        return require("../../assets/icons/cold_plunge.png");
      case "hot-tub":
        return require("../../assets/icons/hot_tub.png");
      case "sauna":
        return require("../../assets/icons/sauna.png");
      default:
        return require("../../assets/icons/cold_plunge.png");
    }
  };

  return (
    <View style={SelectProductStyles.container}>
      {/* Header with back button and progress */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
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
              key={product._id}
              onPress={() => {
                setSelectedProduct(product._id);
                updateStepProgress(1);
              }}
              style={[
                SelectProductStyles.productButton,
                selectedProduct === product._id
                  ? SelectProductStyles.productButtonSelected
                  : SelectProductStyles.productButtonUnselected,
              ]}
            >
              <View style={SelectProductStyles.productIconContainer}>
                <Image
                  source={getProductIcon(product.type)}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={[
                  SelectProductStyles.productName,
                  selectedProduct === product._id
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
          onPress={handleSelectProduct}
          disabled={!selectedProduct || loading}
        />
      </ScrollView>
    </View>
  );
};

export default SelectProductScreen;

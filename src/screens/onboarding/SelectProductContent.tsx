import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import { useAppFlow } from "../../context/AppFlowContext";
import { BackButton } from "../../components/ui";
import API_CONFIG from "../../config/api";
import { SelectProductStyles as styles } from "../../styles/SelectProductStyles";
import { PRODUCTS } from "../../constants/onboarding";

const SelectProductContent = () => {
  const { firebaseUID } = useAuth();
  const { navigateTo, goBack } = useAppFlow();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleNext = async () => {
    if (selectedProducts.length === 0) {
      Alert.alert("Please select at least one product");
      return;
    }

    if (!firebaseUID) {
      Alert.alert("Error", "Authentication required");
      return;
    }

    // Get all selected products
    const products = PRODUCTS.filter((p) => selectedProducts.includes(p.id));
    if (products.length === 0) return;

    setLoading(true);
    try {
      // Save selected products to user profile (using first one as primary)
      const primaryProduct = products[0];
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SELECT_PRODUCT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-firebase-uid": firebaseUID,
          },
          body: JSON.stringify({
            type: primaryProduct.type,
            name: primaryProduct.name,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Store all selected product types for session creation
        await AsyncStorage.setItem(
          "selectedProducts",
          JSON.stringify(products.map((p) => p.type)),
        );
        navigateTo("focusGoal");
      } else {
        console.error("❌ Failed to save selection:", data);
        Alert.alert("Error", data.message || "Failed to save selection");
      }
    } catch (error) {
      console.error("❌ Error saving product:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case "cold-plunge":
        return require("../../../assets/icons/cold_plunge.png");
      case "hot-tub":
        return require("../../../assets/icons/hot_tub.png");
      case "sauna":
        return require("../../../assets/icons/sauna.png");
      default:
        return require("../../../assets/icons/cold_plunge.png");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <BackButton onPress={goBack} />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Personalise your{"\n"}journey—choose{"\n"}your products.
        </Text>

        {/* Product Options */}
        <View style={styles.productList}>
          {PRODUCTS.map((product) => {
            const isSelected = selectedProducts.includes(product.id);
            return (
              <TouchableOpacity
                key={product.id}
                onPress={() => toggleProduct(product.id)}
                activeOpacity={0.8}
              >
                <View style={styles.glassCardWrapper}>

                  {/* Inner card content */}
                  <View
                    style={[
                      styles.productCard,
                      isSelected && styles.productCardSelected,
                    ]}
                  >
                    <View style={styles.productIconContainer}>
                      <Image
                        source={getProductIcon(product.type)}
                        style={styles.productIcon}
                        resizeMode="contain"
                      />
                    </View>
                    <Text
                      style={[
                        styles.productName,
                        isSelected && styles.productNameSelected,
                      ]}
                    >
                      {product.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>
            {loading ? "Saving..." : "Next"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectProductContent;

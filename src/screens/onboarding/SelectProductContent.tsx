import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import { useAppFlow } from "../../context/AppFlowContext";
import { BackButton } from "../../components/ui";
import API_CONFIG from "../../config/api";
import { SelectProductStyles as styles } from "../../styles/SelectProductStyles";

// Hardcoded products - no need to fetch from backend
const PRODUCTS = [
  { id: "cold-plunge", name: "Cold Plunge", type: "cold-plunge" },
  { id: "hot-tub", name: "Hot Tub", type: "hot-tub" },
  { id: "sauna", name: "Sauna", type: "sauna" },
];

const SelectProductContent = () => {
  const { firebaseUID } = useAuth();
  const { navigateTo, goBack } = useAppFlow();

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedProduct) {
      Alert.alert("Please select a product");
      return;
    }

    if (!firebaseUID) {
      Alert.alert("Error", "Authentication required");
      return;
    }

    const product = PRODUCTS.find((p) => p.id === selectedProduct);
    if (!product) return;

    setLoading(true);
    try {
      // Save selected product to user profile
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SELECT_PRODUCT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-firebase-uid": firebaseUID,
          },
          body: JSON.stringify({
            type: product.type,
            name: product.name,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
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
            const isSelected = selectedProduct === product.id;
            return (
              <TouchableOpacity
                key={product.id}
                onPress={() => setSelectedProduct(product.id)}
                activeOpacity={0.8}
              >
                <View style={styles.glassCardWrapper}>
                  {/* Top-left corner shine */}
                  <LinearGradient
                    colors={
                      isSelected
                        ? [
                            "rgba(78, 205, 196, 1)",
                            "rgba(78, 205, 196, 0.4)",
                            "rgba(78, 205, 196, 0.0)",
                          ]
                        : [
                            "rgba(255, 255, 255, 0.75)",
                            "rgba(255, 255, 255, 0.25)",
                            "rgba(255, 255, 255, 0.0)",
                          ]
                    }
                    locations={[0, 0.15, 0.35]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.topLeftShine}
                  />
                  {/* Bottom-right corner shine */}
                  <LinearGradient
                    colors={
                      isSelected
                        ? [
                            "rgba(78, 205, 196, 0.0)",
                            "rgba(78, 205, 196, 0.4)",
                            "rgba(78, 205, 196, 1)",
                          ]
                        : [
                            "rgba(255, 255, 255, 0.0)",
                            "rgba(255, 255, 255, 0.25)",
                            "rgba(255, 255, 255, 0.75)",
                          ]
                    }
                    locations={[0.65, 0.85, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.bottomRightShine}
                  />
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

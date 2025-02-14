// EcoScan.tsx
"use client"

import { useState, useCallback } from "react" // Import useCallback
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native"
import { Camera, Share2, Package, Recycle, CheckCircle, XCircle, Droplet, Lightbulb } from "lucide-react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as ImagePicker from "expo-image-picker"
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const API_ENDPOINT = 'https://ecotrace-8eu1.onrender.com/analyze';

const EcoScanPage = () => {
  const [scanState, setScanState] = useState("upload");
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

    const resetState = useCallback(() => {
        setScanState("upload");
        setProductData(null);
        setSelectedImage(null);
        setIsLoading(false);
        setErrorMessage(null);
    }, []); // Empty dependency array for useCallback

    useFocusEffect(
        useCallback(() => {
          return () => resetState();
        }, [resetState]) // Depend on resetState
    );


  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please take a photo first!")
      return
    }

    setScanState("analyzing")
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await axios.post(API_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setProductData(response.data);
        setScanState('results');
      } else {
        setErrorMessage(`API Error: ${response.status} - ${response.data?.message || 'Unknown Error'}`);
        setScanState('error');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage(`Upload failed: ${error.message || 'Unknown error occurred'}`);
      setScanState('error');
    } finally {
      setIsLoading(false);
    }
  };


  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      alert('Error taking photo: ' + error.message);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView className="flex-1 bg-gray-100">
        {scanState === "upload" && (
          <View>
            <TouchableOpacity
              className="m-5 h-48 justify-center items-center border-2 border-green-700 border-dashed rounded-lg"
              onPress={takePhoto}
            >
              <Camera size={50} color="#2E7D32" />
              <Text className="mt-2 text-green-700">Tap to take a photo</Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            )}
            <TouchableOpacity
              className="mx-5 mb-5 py-3 px-4 bg-green-700 rounded-lg justify-center items-center"
              onPress={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Analyze Product</Text>}
            </TouchableOpacity>
          </View>
        )}

        {scanState === "analyzing" && (
          <View className="p-5">
            <View className="h-2 bg-green-200 rounded-full">
              <View className="w-1/2 h-2 bg-green-700 rounded-full animate-pulse" />
            </View>
            <Text className="mt-2 text-center text-gray-700">Analyzing your product's environmental impact...</Text>
          </View>
        )}

        {scanState === "results" && productData && productData.analysis && (
          <View className="p-4">
            <View className="bg-white rounded-lg shadow-md p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Package size={24} color="#2E7D32" />
                <Text className="ml-2 text-xl font-bold text-gray-800">{productData.analysis.product_name}</Text>
              </View>
              <Text className="text-gray-600 mb-2">{productData.analysis.product_category}</Text>
              <Text className="font-semibold mb-1">Sustainability Score</Text>
              <View className="h-2 bg-gray-200 rounded-full">
                <View
                  className="h-2 bg-green-700 rounded-full"
                  style={{ width: `${productData.analysis.sustainability_score}%` }}
                />
              </View>
              <Text className="mt-1 text-right text-green-700 font-bold">
                {productData.analysis.sustainability_score}/100
              </Text>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="bg-white rounded-lg shadow-md p-4 w-[48%]">
                <Droplet size={24} color="#2E7D32" />
                <Text className="mt-2 text-lg font-bold text-green-700">
                  {productData.analysis.estimated_carbon_footprint_kgCO2} kg
                </Text>
                <Text className="text-gray-600">Carbon Footprint</Text>
              </View>
              <View className="bg-white rounded-lg shadow-md p-4 w-[48%]">
                <Droplet size={24} color="#2E7D32" />
                <Text className="mt-2 text-lg font-bold text-green-700">{productData.analysis.water_usage_liters} L</Text>
                <Text className="text-gray-600">Water Usage</Text>
              </View>
            </View>

            <View className="bg-white rounded-lg shadow-md p-4 mb-4">
              <Text className="text-lg font-bold mb-2">Materials & Recycling</Text>
              <View className="flex-row items-center mb-2">
                <Recycle size={20} color="#2E7D32" />
                <Text className="ml-2 text-gray-700">
                  Primary Material: {productData.analysis.materials.primary_material}
                </Text>
              </View>
              <View className="flex-row items-center mb-2">
                {productData.analysis.recyclability.is_recyclable ? (
                  <CheckCircle size={20} color="#2E7D32" />
                ) : (
                  <XCircle size={20} color="#EF4444" />
                )}
                <Text className="ml-2 text-gray-700">
                  {productData.analysis.recyclability.is_recyclable ? "Recyclable" : "Not Recyclable"}
                </Text>
              </View>
              <Text className="text-gray-600 mt-2">{productData.analysis.recyclability.recycling_instructions}</Text>
            </View>

            <View className="bg-white rounded-lg shadow-md p-4 mb-4">
              <Text className="text-lg font-bold mb-2">Improvement Suggestions</Text>
              {productData.analysis.improvement_suggestions.map((suggestion, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <Lightbulb size={20} color="#2E7D32" />
                  <Text className="ml-2 text-gray-700">{suggestion}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              className="bg-green-700 rounded-lg py-3 px-4 flex-row justify-center items-center"
              onPress={() => {
                /* Implement share functionality */
              }}
            >
              <Share2 size={20} color="white" />
              <Text className="ml-2 text-white font-bold">Share Results</Text>
            </TouchableOpacity>
          </View>
        )}

        {scanState === 'error' && (
          <View className="p-4">
            <Text className="text-red-500">{errorMessage || 'An error occurred during analysis.'}</Text>
            <TouchableOpacity
              className="bg-blue-500 rounded-lg py-3 px-4 flex-row justify-center items-center mt-4"
              onPress={() => setScanState('upload')}
            >
              <Text className="ml-2 text-white font-bold">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  imagePreview: {
    width: "90%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
})

export default EcoScanPage
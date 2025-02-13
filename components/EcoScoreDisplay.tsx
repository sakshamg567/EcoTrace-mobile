// components/EcoScoreDisplay.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface EcoScoreDisplayProps {
   ecoScore: number;
}

const EcoScoreDisplay: React.FC<EcoScoreDisplayProps> = ({ ecoScore }) => {
   return (
      <View className="items-center mb-7">
         <View className="w-36 h-36 rounded-full border-10 border-gray-200 justify-center items-center relative">
            <Text className="text-5xl font-pbold text-green-800">{ecoScore}</Text>
            <View className="absolute left-[-10] top-[-10] w-full h-full rounded-full border-10 border-green-500 border-r-transparent border-t-transparent" style={{ width: `${ecoScore}%` }} />
         </View>
         <Text className="mt-2 text-lg text-green-800 font-pregular">Your Eco Score (Past 7 Days): {ecoScore}/100 🌟</Text>
      </View>
   );
};

export default EcoScoreDisplay;
// components/EcoScoreDisplay.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface EcoScoreDisplayProps {
  ecoScore: number;
}

const EcoScoreDisplay: React.FC<EcoScoreDisplayProps> = ({ ecoScore }) => {
//   const rotation = (ecoScore / 100) * 180;

  return (
    <View className="items-center mb-7">
      <View>
        <Text style={{
          fontSize: 44, 
          color: '#06d6a0',
          position: 'relative',
          zIndex: 2,
           // Ensure text is above the semicircle
        }} className='font-pregular'>{ecoScore}</Text>
      </View>
      <Text className="mt-2 text-md text-green-800 font-pregular">
        Your Eco Score (Past 7 Days): {ecoScore}/100 🌟
      </Text>
    </View>
  );
};

export default EcoScoreDisplay;
// components/TodayMetrics.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface TodayMetricsProps {
   todayEmissions: number;
   todayTrend: string;
   co2Saved: number;
}

const TodayMetrics: React.FC<TodayMetricsProps> = ({ todayEmissions, todayTrend, co2Saved }) => {
   const isPositiveTrend = todayTrend.includes('↓') || todayTrend.includes('0');

   return (
      <View className="px-5 mb-20">
         <View className="flex-row items-center mb-1">
            <Text className="text-lg font-pmedium text-green-800">Today's Total: {todayEmissions} kg CO₂e</Text>
            <Text className={`text-sm ml-2 font-pregular ${isPositiveTrend ? 'text-green-500' : 'text-coral-500'}`}>
               {todayTrend} from yesterday
            </Text>
         </View>
         <Text className="text-base font-pregular text-green-800">You've Saved {co2Saved} kg CO₂ 🌱</Text>
      </View>
   );
};

export default TodayMetrics;
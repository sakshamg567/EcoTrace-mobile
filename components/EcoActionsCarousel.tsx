// components/EcoActionsCarousel.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EcoActionsCarouselProps {
   actionCards: any[]; // Type this more specifically if needed
}

// ActionCard Component (moved here for encapsulation)
const ActionCard = ({ card }) => (
   <View className="bg-white w-40 p-4 rounded-xl mr-4 items-center shadow-md">
      <View className="bg-green-50 p-2 rounded-full mb-2">
         <MaterialCommunityIcons name={card.icon} size={35} color="#2E7D32" />
      </View>
      <Text className="text-base font-psemibold text-center text-green-800 mb-1">{card.title}</Text>
      <Text className="text-sm text-center text-gray-500 mb-2">{card.description}</Text>
      <TouchableOpacity className="bg-teal-500 py-2 px-3 rounded-lg" onPress={card.onAction}>
         <Text className="text-white font-pmedium text-sm">{card.actionText}</Text>
      </TouchableOpacity>
   </View>
);

const EcoActionsCarousel: React.FC<EcoActionsCarouselProps> = ({ actionCards }) => {
   return (
      <View className="px-5 mb-7">
         <Text className="text-xl font-psemibold text-green-800 mb-3">Eco Actions</Text>
         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {actionCards.map((card, index) => (
               <ActionCard key={index} card={card} />
            ))}
         </ScrollView>
      </View>
   );
};

export default EcoActionsCarousel;
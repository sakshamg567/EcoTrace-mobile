import { Text, View } from "react-native";
import {verifyInstallation} from 'nativewind';
export default function Index() {
  verifyInstallation();

  return (
    <View className="flex">
      <Text className="text-emerald-600">HELLO WORLD</Text>
    </View>
  );
}

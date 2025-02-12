import { Text, View } from "react-native";
import {verifyInstallation} from 'nativewind';
import { Link } from "expo-router";
export default function Index() {
  // verifyInstallation();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-emerald-600">HELLO WORLD</Text>
      <Link href="/Home">Home</Link>
      {/* <Link href={""}>auth page</Link> */}
    </View>
  );
}

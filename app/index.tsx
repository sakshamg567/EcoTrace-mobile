import { useEffect } from "react"
import { Text, View, Image, TouchableOpacity } from "react-native"
import { useRouter, Link } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { images } from "../constants"
// This is a placeholder function. Replace it with your actual authentication check.
const isUserSignedIn = () => {
  // Implement your authentication check here
  return true
}

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      if (isUserSignedIn()) {
        router.replace("/Home")
      }
    },0)
  }, [router]) // Added router to dependencies

  return (
    <SafeAreaView className="bg-green-50 h-full ">
      <StatusBar style="dark" backgroundColor="#f0fdf4" />
      <View className="flex-1 justify-around p-6 min-h-[85vh] items-center">
        <View className="items-center -mt-10 mb-16">
          <Text className="text-3xl font-pbold text-green-800 mt-4">EcoTrace</Text>
          <Text className="text-lg text-green-600 text-center mt-2 font-plight">Track and reduce your carbon footprint</Text>
        </View>
        <Image 
          source={images.earth}
          className="w-[100vw] max-w-[380px] absolute top-16  "
          resizeMode="contain"
        />
        <View className="space-y-6 mt-36">
          <Text className="text-lg mb-5 font-plight text-green-800 text-center -bottom-20">Ready to make a difference?</Text>
          <Link href="/sign-in" asChild className="-bottom-20">
            <TouchableOpacity className="bg-green-500 rounded-full py-4 items-center" activeOpacity={0.8}>
              <Text className="text-white font-pbold text-lg">Get Started</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text className="text-center text-green-600 mt-6 font-plight text-xs -bottom-5">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  )
}


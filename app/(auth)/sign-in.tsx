import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { FormField } from "../../components";


const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  return (
    <SafeAreaView className="bg-green-50 h-full">
      <ScrollView>
        <View
          className="w-full flex-1 justify-center h-full px-4 my-6 items-center"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >

          <Text className="text-2xl font-semibold text-green-600 mt-10 font-psemibold">
            Log in To EcoTrace
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            placeholder={"abc@example.com"}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles=""
          />


          <View className="flex pt-5 flex-row gap-2 items-center">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignIn;
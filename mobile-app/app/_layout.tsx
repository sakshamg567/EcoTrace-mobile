// app/_layout.tsx
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect } from "react";
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/clerk-expo"
import "../global.css";

import { SafeAreaView, ActivityIndicator, StyleSheet, Text } from 'react-native'; // Import components
import React from 'react'
import { tokenCache } from "@/cache";

const RootLayout = () => {

    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

    if (!publishableKey) {
        throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file')
    }

    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    });

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);


    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            {/* ALWAYS render the Stack navigator */}
            <Stack screenOptions={{ headerShown: false }}>
                <ClerkLoading>
                    {/* Show a loading screen while Clerk is loading */}
                    <Stack.Screen name="loading" options={{ headerShown: false }} />
                </ClerkLoading>

                <ClerkLoaded>
                    {/* Show the actual screens once Clerk is loaded */}
                    {!fontsLoaded ? (
                        <Stack.Screen name="loading" options={{ headerShown: false }} />
                    ) : (
                        <>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                        </>
                    )}

                </ClerkLoaded>
            </Stack>
        </ClerkProvider>
    );
}

export default RootLayout;
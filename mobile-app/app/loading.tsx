import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalSearchParams } from 'expo-router'; // Import useGlobalSearchParams
import React from 'react'


const LoadingScreen = () => {

    const { loadingMessage } = useGlobalSearchParams();

    return (
        <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.loadingText}>{loadingMessage || "Loading..."}</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0fdf4', // Or any background color you prefer
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#2E7D32',
        fontFamily: 'Poppins-Regular',
    },
});

export default LoadingScreen;
// app/(auth)/sign-in.tsx
import { useState } from "react";
import React from "react";
import { useSignIn } from '@clerk/clerk-expo';
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn();
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSignInPress = async () => {
        if (!isLoaded) return;

        setLoading(true);
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/(tabs)/Home');
            } else {
                Alert.alert("Sign In Incomplete", "Please check your email for further instructions.");
            }
        } catch (err: any) {
            Alert.alert("Sign In Error", err.errors[0].longMessage);
            console.error("Sign in error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Log in To EcoTrace</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={emailAddress}
                            onChangeText={(email) => {setEmailAddress(email)}}
                            placeholder="Enter your email"
                            placeholderTextColor="#a9a9a9"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={(pass) => {setPassword(pass)}}
                                placeholder="Enter your password"
                                placeholderTextColor="#a9a9a9"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                style={styles.eyeIconContainer}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <MaterialCommunityIcons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="#4b5563"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={onSignInPress} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
                    </TouchableOpacity>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account?</Text>
                        <Link href="/(auth)/sign-up" style={styles.signUpLink}>
                            Sign up
                        </Link>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0fdf4',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        color: '#10a326',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontFamily: 'Poppins-Medium',
        color: '#4b5563',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        padding: 15,
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        color: '#1f2937',
        backgroundColor: '#f9fafb',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingRight: 12,
        backgroundColor: '#f9fafb',
    },
    passwordInput: {
        flex: 1,
        padding: 12,
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        color: '#1f2937',
    },
    eyeIconContainer: {
        padding: 10,
    },
    button: {
        backgroundColor: '#10a326',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signUpText: {
        fontSize: 10,
        fontFamily: 'Poppins-Regular',
        color: '#4b5563',
    },
    signUpLink: {
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        color: '#10a326',
        marginLeft: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
});

export default SignIn;
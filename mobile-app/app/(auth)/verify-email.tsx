// app/(auth)/verify-email.tsx

import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert
} from "react-native";

const VerifyEmail = () => {
    const { isLoaded, setActive, signUp } = useSignUp();
    const [code, setCode] = React.useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const onVerifyCode = async () => {
        if (!isLoaded) {
            return null;
        }

        setLoading(true);

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            // complete the sign up process.
            await setActive({ session: completeSignUp.createdSessionId });

            // navigate to the home screen if the sign up/in is complete
            router.replace("/(tabs)/Home");

        } catch (err: any) {
            Alert.alert("Verification Error", err.errors[0].longMessage);
            console.error(JSON.stringify(err, null, 2));
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
                    <Text style={styles.title}>Verify Your Email</Text>
                    <Text style={styles.subtitle}>
                        We've sent a verification code to your email. Please enter it below.
                    </Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Verification Code</Text>
                        <TextInput
                            style={styles.input}
                            value={code}
                            onChangeText={setCode}
                            placeholder="Enter code"
                            placeholderTextColor="#a9a9a9"
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            autoFocus={true} // Automatically focus on this input
                        />
                    </View>

                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={onVerifyCode} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify Code"}</Text>
          </TouchableOpacity>
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
        marginBottom: 10, // Reduced margin
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#4b5563',
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
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#1f2937',
        backgroundColor: '#f9fafb',
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
    buttonDisabled: {
        opacity: 0.7,
    },
});


export default VerifyEmail;
// app/(auth)/sign-up.tsx
import { useState } from "react";
import React from "react";
import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Instead of setting state, directly navigate.  This is the *correct* way.
      setPendingVerification(true)
    } catch (err: any) {
      Alert.alert("Sign Up Error", err.errors[0].longMessage);
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false)
    }
  };
    const onVerifyPress = async () => {
      if (!isLoaded) return

      try {
        // Use the code the user provided to attempt verification
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
          code,
        })

        // If verification was completed, set the session to active
        // and redirect the user
        if (signUpAttempt.status === 'complete') {
          await setActive({ session: signUpAttempt.createdSessionId })
          router.replace("/(tabs)/Home")
        } else {
          // If the status is not complete, check why. User may need to
          // complete further steps.
          console.error(JSON.stringify(signUpAttempt, null, 2))
        }
      } catch (err: any) {
           Alert.alert("Sign Up Error", err.errors[0].longMessage);
        console.error(JSON.stringify(err, null, 2))
      }
    }

    if (pendingVerification) {
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

                    <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={onVerifyPress} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify Code"}</Text>
          </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign Up for EcoTrace</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={emailAddress}
              onChangeText={setEmailAddress}
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
                onChangeText={setPassword}
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#a9a9a9"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#4b5563"
                />
              </TouchableOpacity>
            </View>
          </View>


          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={onSignUpPress}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <Link href="/(auth)/sign-in" style={styles.signInLink}>
              Sign in
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signInText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#4b5563',
  },
  signInLink: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#10a326',
    marginLeft: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default SignUp;
// app/(auth)/sign-in.tsx
import { useState } from "react";
import React from "react";
import { useSignIn } from '@clerk/clerk-expo'
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"; // Import necessary components
import { MaterialCommunityIcons } from '@expo/vector-icons'; // For the eye icon

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior for iOS and Android
        style={styles.container}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Log in To EcoTrace</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={emailAddress}
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              placeholder="Enter your email"
              placeholderTextColor="#a9a9a9"
              keyboardType="email-address"
              autoCapitalize="none" // Prevent auto-capitalization
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={(password) => setPassword(password)}
                placeholder="Enter your password"
                placeholderTextColor="#a9a9a9"
                secureTextEntry={!showPassword} // Toggle secure text entry
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

          <TouchableOpacity style={styles.button} onPress={onSignInPress}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <Link href="/sign-up" style={styles.signUpLink}>
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
    backgroundColor: '#f0fdf4', // Light green background
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
    color: '#10a326', // Dark green
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#4b5563', // Dark gray
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db', // Light gray
    borderRadius: 8,
    padding: 15,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#1f2937', // Darker gray for input text
    backgroundColor: '#f9fafb',
  },
    passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingRight: 12, //Padding for the icon
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
    padding: 10, // Make the touchable area larger
  },
  button: {
    backgroundColor: '#10a326', // Dark green
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
    color: '#10a326', // Dark green
    marginLeft: 5,
  },
});

export default SignIn;
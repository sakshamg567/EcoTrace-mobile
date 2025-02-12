import { Stack } from "expo-router";

import "../global.css";

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RootLayout = () => {
  return (
    <Stack >
      <Stack.Screen name="index"/>
    </Stack>
  )
}

export default RootLayout

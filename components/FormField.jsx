import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const FormField = ({
  title, value, placeholder,
  handleChangeText, otherStyles, ...props
}) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className=''>
        {title}
      </Text>
      <View className='min-w-[95vw] h-16 border-red-200 border-2 rounded-xl px-4 bg-white'>

      </View>
    </View>
  )
}

export default FormField

const styles = StyleSheet.create({})
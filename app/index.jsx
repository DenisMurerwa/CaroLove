import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React from 'react'

const RootLayout = () => {
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-3xl'>This is just a Test!</Text>
      <StatusBar style="auto" />
    </View>
  )
}

export default RootLayout

const styles = StyleSheet.create({})

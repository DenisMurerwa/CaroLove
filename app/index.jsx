import { Text, View, Image, Animated, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useRef, useEffect } from 'react';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';

export default function Page() {
  
  const fadeAnim = useRef(new Animated.Value(0)).current; 

  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, 
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
          <Image
            source={images.logo}
            className='w-[220px] h-[174px]'
            resizeMode='contain'
          />
          <Image
            source={images.love}
            className='max-w-[380px] w-full h-[300px]'
            resizeMode='contain'
          />

          <View>
            <Text className='text-3xl text-white font-bold text-center'>
              Welcome!..Ready to Find Your Better Half? {' '}
              <Text className='text-white'>🤍</Text>
            </Text>

            <Animated.View style={{ opacity: fadeAnim }}>
              <Text className='text-sm font-pregular text-gray-100 mt-7 text-center'>
                Swipe right if you’re tired of being the third wheel.
                Swipe left on boring conversations.
                Let’s find someone who’ll steal your heart (and maybe your fries)!
              </Text>
            </Animated.View>
          </View>

          <CustomButton
            title='Continue With Email'
            handlePress={() => router.push('/sign-in')}
            containerStyles='w-full mt-7'
            textStyles="text-[#FE3C72]"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#FE3C72' style='light' />
    </SafeAreaView>
  );
}

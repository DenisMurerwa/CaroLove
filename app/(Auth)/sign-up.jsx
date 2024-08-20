import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { Link } from 'expo-router';
import { images } from '../../constants'; // Ensure correct path
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase'; // Your Firebase config
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '' // State for confirm password
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();

  const submit = async () => {
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      navigation.navigate('onboard'); // Navigate to the Onboarding page
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[83vh] px-4 my-6'>
          <Image
            source={images.logo}
            resizeMode='contain'
            className='w-[115px] h-[135px]'
          />

          <Text className='text-2xl text-white text-semibold font-psemibold'>
            Sign Up to Caro Love
          </Text>

          

          <FormField
            title='Email'
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType='email-address'
          />

          <FormField
            title='Password'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
            secureTextEntry={true} // Hide password input
          />
          
          <FormField
            title='Confirm Password'
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            otherStyles='mt-7'
            secureTextEntry={true} // Hide password input
          />

          <CustomButton
            title='Sign Up'
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className='text-lg text-gray-100 font-pregular'>
              Already have an account?
            </Text>
            <Link href='/sign-in' className='text-lg font-psemibold text-white'>Login</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

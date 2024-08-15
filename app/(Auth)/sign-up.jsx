  import { View, Text, ScrollView, Image  } from 'react-native'
  import React from 'react'
  import {useState} from 'react'
  import { SafeAreaView } from 'react-native-safe-area-context'
  
  import {images} from '../../constants'
  import FormField from '../../components/FormField'
  import CustomButton from '../../components/CustomButton'
  import { Link } from 'expo-router'

  
  
  const SignUp = () => {
    const [form, setform] = useState({
      username:'',
      email:'',
      password:''
    })
  const submit = () => {
    
  }
  const [isSubmitting, setisSubmitting] = useState(false)
    return (
      <SafeAreaView className='bg-primary h-full'>
        <ScrollView>
          <View className='w-full justify-center min-h-[83vh] px-4 my-6'>
  
            <Image source={images.logo}
            resizeMode='contain' className='w-[115px]
            h-[135px]'          
            />
            <Text className='text-2xl text-white text-semibold  font-psemibold'>
              Sign Up to Caro Love
            </Text>
            <FormField
            title='User Name'
            value={form.username}
            handleChangeText={(e) => setform({...form,
              username: e
            })}
            otherStyles='mt-10'
        
            />
            <FormField
            title='Email'
            value={form.email}
            handleChangeText={(e) => setform({...form,
              email: e
            })}
            otherStyles='mt-7'
          keyboardType='email-address'
            />
            <FormField
            title='Password'
            value={form.password}
            handleChangeText={(e) => setform({...form,
              password: e
            })}
            otherStyles='mt-7'
            />
  
            <CustomButton
            title='sign-up'
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
    )
  }
  
  export default SignUp

import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // For image selection
import { ref, set } from 'firebase/database';
import { auth, database } from '../../firebase'; // Your Firebase config
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { images } from '../../constants'; // Ensure correct path
import { Picker } from '@react-native-picker/picker'; // Updated import for Picker

const Onboard = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    profilePicture: '',
    maritalStatus: '',
    city: '',
    phoneNumber: '',
    gender: '' // Added gender state
  });
  const [image, setImage] = useState(null); // State to hold the image
  const router = useRouter();


  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      setUserDetails({ ...userDetails, profilePicture: selectedImage });
    } else {
      console.warn('Image selection was canceled or failed');
    }
  };
  

  const handleSubmit = async () => {
    const userId = auth.currentUser.uid;
  
    // Check if the profilePicture is defined
    if (!userDetails.profilePicture) {
      console.warn('Profile picture is undefined, cannot submit.');
      return;
    }
  
    try {
      await set(ref(database, `/users/${userId}`), {
        ...userDetails,
        email: auth.currentUser.email,
      });
  
      // Navigate to the Home page using the router
      router.push('/home');
    } catch (error) {
      console.error(error.message);
    }
  };
  

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[83vh] px-4 my-6'>
          <Image
            source={images.logo} // Assuming the same logo is used
            resizeMode='contain'
            className='w-[115px] h-[135px]'
          />

          <Text className='text-2xl text-white text-semibold font-psemibold'>
            Complete Your Profile
          </Text>

          <FormField
            title='Name'
            value={userDetails.name}
            handleChangeText={(text) => setUserDetails({ ...userDetails, name: text })}
            otherStyles='mt-10'
          />

          <View className='mt-7'>
            <Text className='text-white'>Marital Status</Text>
            <Picker
              selectedValue={userDetails.maritalStatus}
              onValueChange={(itemValue) => setUserDetails({ ...userDetails, maritalStatus: itemValue })}
              style={{ height: 50, width: '100%', backgroundColor: '#fff', borderRadius: 5 }}
            >
              <Picker.Item label="Single" value="single" />
              <Picker.Item label="Married" value="married" />
            </Picker>
          </View>

          <View className='mt-7'>
            <Text className='text-white'>Gender</Text>
            <Picker
              selectedValue={userDetails.gender}
              onValueChange={(itemValue) => setUserDetails({ ...userDetails, gender: itemValue })}
              style={{ height: 50, width: '100%', backgroundColor: '#fff', borderRadius: 5 }}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>

          <FormField
            title='City'
            value={userDetails.city}
            handleChangeText={(text) => setUserDetails({ ...userDetails, city: text })}
            otherStyles='mt-7'
          />

          <FormField
            title='Phone Number'
            value={userDetails.phoneNumber}
            handleChangeText={(text) => setUserDetails({ ...userDetails, phoneNumber: text })}
            otherStyles='mt-7'
            keyboardType='phone-pad'
          />

          <CustomButton
            title='Pick an Image'
            handlePress={handleImagePick}
            containerStyles='mt-7'
            isLoading={false} // Customize if needed
          />
          {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}

          <CustomButton
            title='Submit'
            handlePress={handleSubmit}
            containerStyles='mt-7'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboard;

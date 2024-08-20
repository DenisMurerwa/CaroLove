import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updatePassword } from 'firebase/auth';
import images from '../../constants/images';

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [phoneNumber, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setImage(data.profilePicture); 
          setName(data.name);
          setNumber(data.phoneNumber);
          setEmail(data.email);
          setCity(data.city);
        }
      });
    }
  }, [user]);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const pickedImage = result.assets[0].uri; // Updated to access the URI correctly
      setImage(pickedImage);
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);
      update(userRef, { profilePicture: pickedImage });
    }
  };

  const handleSave = () => {
    const db = getDatabase();
    const userRef = ref(db, 'users/' + user.uid);
    update(userRef, {
      name,
      phoneNumber,
      profilePicture: image, 
    }).then(() => {
      Alert.alert('Success', 'Profile updated successfully!');
    }).catch((error) => {
      Alert.alert('Error', error.message);
    });

    if (password) {
      updatePassword(user, password).then(() => {
        Alert.alert('Success', 'Password updated successfully!');
      }).catch((error) => {
        Alert.alert('Error', error.message);
      });
    }
  };

  return (
    <ScrollView className="bg-white flex-1">
      <View className="justify-center items-center min-h-[85vh] px-4 bg-white">
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={image ? { uri: image } : images.profile} 
            className="w-24 h-24 justify-center items-center rounded-full mb-2"
          />
          <Text className="text-[#FE3C72] justify-center items-center mb-2 font-semibold">Change Profile</Text>
        </TouchableOpacity>
        
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#CDCDE0"
          className="bg-[#F7F7F7] p-4 rounded-lg w-full mb-4"
        />
        
        <TextInput
          value={email}
          editable={false} // Make email non-editable
          placeholder="Email"
          placeholderTextColor="#CDCDE0"
          className="bg-[#F7F7F7] p-4 rounded-lg w-full mb-4"
          keyboardType="email-address"
        />
        
        <TextInput
          value={phoneNumber}
          onChangeText={setNumber}
          placeholder="Phone Number"
          placeholderTextColor="#CDCDE0"
          className="bg-[#F7F7F7] p-4 rounded-lg w-full mb-4"
          keyboardType="phone-pad"
        />
        
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="City"
          placeholderTextColor="#CDCDE0"
          className="bg-[#F7F7F7] p-4 rounded-lg w-full mb-4"
        />
        
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="New Password"
          placeholderTextColor="#CDCDE0"
          className="bg-[#F7F7F7] p-4 rounded-lg w-full mb-6"
          secureTextEntry
        />
        
        <TouchableOpacity onPress={handleSave} className="bg-[#FE3C72] p-4 rounded-lg w-full">
          <Text className="text-white font-semibold text-center">Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({});

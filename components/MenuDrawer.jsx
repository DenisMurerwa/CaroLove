import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router'; // Import Link for navigation

const MenuDrawer = () => {
  return (
    <View className="flex-1 bg-white mt-6">
      {/* Top section with profile info */}
      <View className="bg-[#FE3C72] p-5 flex-row items-center">
        {/* Profile picture */}
        <Image
          source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder image
          className="w-12 h-12 rounded-full mr-4"
        />
        <View>
          <Text className="text-white text-lg font-bold">Denis Murerwa</Text>
          <Text className="text-white">+254 710 858 995</Text>
        </View>
      </View>

      {/* Menu items */}
      <View className="flex-1 p-5">
        <Link href="/(Tabs)/home" asChild>
          <TouchableOpacity className="flex-row items-center p-4 rounded-lg mb-3">
            <Icon name="home" size={24} color="#FE3C72" style={{ marginRight: 16 }} />
            <Text className="text-[#FE3C72] text-lg font-semibold">Home</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/settings" asChild>
          <TouchableOpacity className="flex-row items-center p-4 rounded-lg mb-3">
            <Icon name="cog" size={24} color="#FE3C72" style={{ marginRight: 16 }} />
            <Text className="text-[#FE3C72] text-lg font-semibold">Settings</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(Tabs)/profile" asChild>
          <TouchableOpacity className="flex-row items-center p-4 rounded-lg mb-3">
            <Icon name="user" size={24} color="#FE3C72" style={{ marginRight: 16 }} />
            <Text className="text-[#FE3C72] text-lg font-semibold">Profile</Text>
          </TouchableOpacity>
        </Link>
        
        {/* Divider Line */}
        <View className="border-t border-[#FE3C72] my-4" />

        {/* Logout Button */}
        <TouchableOpacity
          className="flex-row items-center p-4 rounded-lg"
          onPress={() => console.log('Logout Pressed')} // Replace with actual logout functionality
        >
          <Icon name="sign-out" size={24} color="#FE3C72" style={{ marginRight: 16 }} />
          <Text className="text-[#FE3C72] text-lg font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuDrawer;

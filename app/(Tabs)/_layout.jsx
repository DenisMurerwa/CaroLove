import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { DrawerLayout } from 'react-native-gesture-handler';
import { icons } from '../../constants';
import MenuDrawer from '../../components/MenuDrawer';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const drawerRef = useRef(null);

  const openDrawer = () => {
    drawerRef.current.openDrawer();
  };

  return (
    <DrawerLayout
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={() => <MenuDrawer />}
    >
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#9DFF00',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#FE3C72', // Bottom tab bar color
            borderTopWidth: 1,
            borderTopColor: '#9DFF00',
            height: 84,
          },
          headerStyle: {
            backgroundColor: '#FE3C72', // Top menu bar color
          },
          headerTintColor: '#FFFFFF', // Text color in the header
          headerLeft: () => (
            <TouchableOpacity onPress={openDrawer}>
              <Image
                source={icons.menu}
                className="w-10 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: 'Chats',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.chats}
                color={color}
                name="Chats"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </DrawerLayout>
  );
};

export default TabsLayout;

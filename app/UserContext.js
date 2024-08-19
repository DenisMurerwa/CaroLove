import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setSelectedUser = async (userData) => {
    console.log('Setting selected user:', userData);
    if (userData && userData.id !== user?.id) {
      setUser(userData);
    }
  };

  const setCurrentUser = async (userData) => {
    await AsyncStorage.setItem('currentUserId', userData.id);
    setUser(userData);
  };

  const getCurrentUser = async () => {
    const userId = await AsyncStorage.getItem('currentUserId');
    return userId;
  };

  return (
    <UserContext.Provider value={{ user, setSelectedUser, setCurrentUser, getCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

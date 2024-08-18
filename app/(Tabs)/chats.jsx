import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext'; // Adjust the path as necessary
import { getAuth } from 'firebase/auth';

const Chats = () => {
  const router = useRouter();
  const { selectedUser } = useUser(); // Access the selected user from context
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    setUserId(auth.currentUser?.uid);
  }, []);

  useEffect(() => {
    if (userId) {
      const db = getDatabase();
      const chatsRef = ref(db, 'chats');

      const handleChatsUpdate = (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const chatList = Object.keys(data)
            .filter(key => data[key].participants.includes(userId)) // Only show chats where the user is a participant
            .map(key => ({
              id: key,
              ...data[key]
            }));
          setChats(chatList);
        }
      };

      const unsubscribe = onValue(chatsRef, handleChatsUpdate);

      return () => unsubscribe(); // Clean up listener
    }
  }, [userId]);

  const handleChatPress = (chatId) => {
    router.push(`/message?chatId=${chatId}`); // Adjust the path as per your actual routing structure
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item.id)}>
      <Text style={styles.chatName}>{item.chatPartner?.name || 'Unknown'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatName: {
    fontSize: 18,
  },
});

export default Chats;

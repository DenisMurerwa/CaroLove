import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getDatabase, ref, onValue, get, update } from 'firebase/database';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, handleNotifications } from './NotificationService'; // Adjust the path as needed

const Chats = () => {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      registerForPushNotificationsAsync();
      handleNotifications();
    } else {
      console.error('No authenticated user found');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const db = getDatabase();
      const chatsRef = ref(db, 'chats');

      const handleChatsUpdate = async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const chatList = Object.keys(data)
            .filter(key => {
              const chat = data[key];
              const participants = [chat.user1Id, chat.user2Id];
              return participants.includes(userId);
            })
            .map(key => ({
              id: key,
              ...data[key]
            }));

          await fetchChatPartners(chatList);
        }
      };

      const unsubscribe = onValue(chatsRef, handleChatsUpdate);

      return () => unsubscribe();
    }
  }, [userId]);

  const fetchChatPartners = async (chatList) => {
    const db = getDatabase();
    const updatedChats = await Promise.all(chatList.map(async (chat) => {
      const partnerId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
      if (partnerId) {
        const userRef = ref(db, `users/${partnerId}`);
        const snapshot = await get(userRef);
        const partnerData = snapshot.val();
        
        const messages = chat.messages;
        const messageKeys = Object.keys(messages);
        const lastMessageKey = messageKeys[messageKeys.length - 1];
        const lastMessage = messages[lastMessageKey];

        const newMessageCount = messageKeys.filter(key => messages[key].senderId !== userId && !messages[key].read).length;

        if (newMessageCount > 0) {
          sendNotification(partnerData.name, lastMessage.text);
        }

        return {
          ...chat,
          chatPartner: partnerData,
          lastMessage: lastMessage.text,
          lastMessageTimestamp: new Date(lastMessage.timestamp).getTime(),
          newMessageCount,
        };
      }
      return chat;
    }));

    updatedChats.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

    setChats(updatedChats);
    setLoading(false);
  };

  const sendNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: null,
    });
  };

  const handleChatPress = async (chatId) => {
    const db = getDatabase();
    const chatRef = ref(db, `chats/${chatId}/messages`);
    const snapshot = await get(chatRef);

    if (snapshot.exists()) {
      const messages = snapshot.val();
      const messageKeys = Object.keys(messages);

      const updates = {};
      messageKeys.forEach(key => {
        if (messages[key].senderId !== userId && !messages[key].read) {
          updates[`${key}/read`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(chatRef, updates);
      }
    }

    router.push(`/message?chatId=${chatId}`);
  };

  const renderChatItem = ({ item }) => {
    const chatPartner = item.chatPartner || {};
    return (
      <TouchableOpacity 
        style={[styles.chatItem, item.newMessageCount > 0 && styles.newMessage]} 
        onPress={() => handleChatPress(item.id)}
      >
        <Image
          source={{ uri: chatPartner.profilePicture || 'https://example.com/default-image.jpg' }}
          style={styles.avatar}
        />
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{chatPartner.name || 'Unknown'}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage || 'No messages yet'}</Text>
        </View>
        {item.newMessageCount > 0 && (
          <View style={styles.newMessageCountContainer}>
            <Text style={styles.newMessageCountText}>{item.newMessageCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
    backgroundColor: '#f8f9fa',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  newMessage: {
    backgroundColor: '#e0f7fa',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#ccc',
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 18,
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
  },
  newMessageCountContainer: {
    backgroundColor: '#FE3C72',
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newMessageCountText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Chats;

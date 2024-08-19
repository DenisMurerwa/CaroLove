import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getDatabase, ref, push, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const Messages = () => {
  const { chatId, userId: selectedUserId } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      console.error('No user is authenticated');
    }
  }, []);

  useEffect(() => {
    if (!chatId || !userId) {
      console.error('Chat ID or User ID is missing');
      return;
    }

    const db = getDatabase();
    const chatRef = ref(db, `chats/${chatId}`);

    const unsubscribe = onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const currentUserId = userId;
        const chatPartnerId = data.user1Id === currentUserId ? data.user2Id : data.user1Id;

        setMessages(Object.values(data.messages || {}));
        setChatPartner(chatPartnerId);
      } else {
        console.error('No chat data available');
      }
    });

    return () => {
      console.log('Unsubscribing from chat data');
      unsubscribe();
    };
  }, [chatId, userId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      console.warn('Message is empty');
      return;
    }

    if (!chatId || !userId) {
      console.error('Chat ID or User ID is missing');
      return;
    }

    const db = getDatabase();
    const messagesRef = ref(db, `chats/${chatId}/messages`);
    const newMessageRef = push(messagesRef);

    set(newMessageRef, {
      text: newMessage,
      timestamp: new Date().toISOString(),
      senderId: userId,
    })
      .then(() => {
        setNewMessage('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {chatPartner ? (
          <Text style={styles.chatPartner}>Chatting with: {chatPartner}</Text>
        ) : (
          <Text>No chat partner found</Text>
        )}
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <View key={index} style={styles.message}>
              <Text>{message.text}</Text>
            </View>
          ))
        ) : (
          <Text>No messages yet</Text>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    padding: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  chatPartner: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
});

export default Messages;

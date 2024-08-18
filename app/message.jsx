// Messages.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getDatabase, ref, push, onValue } from 'firebase/database';
import { useUser } from './UserContext';

const Messages = () => {
  const { chatId } = useLocalSearchParams();
  const { selectedUser } = useUser();
  const [messages, setMessages] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    console.log('Received chatId:', chatId);

    if (chatId) {
      const db = getDatabase();
      const chatRef = ref(db, `chats/${chatId}`);

      const unsubscribe = onValue(chatRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setMessages(data.messages || []);
          setChatPartner(data.chatPartner);
        } else {
          console.log('No chat data available');
        }
      });

      return () => unsubscribe();
    } else {
      console.error('No chat ID provided');
    }
  }, [chatId]);

  const handleSendMessage = () => {
    if (chatId && newMessage.trim()) {
      const db = getDatabase();
      const chatRef = ref(db, `chats/${chatId}/messages`);
      const newMessageRef = push(chatRef);
      newMessageRef.set({
        text: newMessage,
        timestamp: new Date().toISOString(),
        senderId: selectedUser?.id,
      }).then(() => {
        setNewMessage('');
      }).catch((error) => {
        console.error('Error sending message:', error);
      });
    } else {
      console.warn('Chat ID or message is missing');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {chatPartner ? (
          <Text style={styles.chatPartner}>Chatting with: {chatPartner.name}</Text>
        ) : (
          <Text>No chat partner found</Text>
        )}
        {messages.map((message, index) => (
          <View key={index} style={styles.message}>
            <Text>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <Button title="Send"  onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:8,
    padding: 16,
  },
  messagesContainer: {
    flex: 1,
  },
  chatPartner: {
    fontSize: 18,
    fontWeight: 'bold',
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

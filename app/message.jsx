import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getDatabase, ref, push, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const Messages = () => {
  const { chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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
        setMessages(Object.values(data.messages || {}));
      } else {
        console.error('No chat data available');
      }
    });

    return () => {
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
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.message,
                message.senderId === userId
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.senderId === userId
                    ? styles.sentMessageText
                    : styles.receivedMessageText,
                ]}
              >
                {message.text}
              </Text>
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
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16, // Margin top for the whole container
    padding: 16,
  },
  messagesContainer: {
    flex: 1,
    marginTop: 16, // Add margin to the top of messages
  },
  message: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    maxWidth: '75%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FE3C72', // Vibrant pink
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF9500', // Bright orange
  },
  messageText: {
    color: '#fff',
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#fff',
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
  sendButton: {
    backgroundColor: '#FE3C72', // Pink color for the button
    borderRadius: 4,
    padding: 10,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Messages;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { getDatabase, ref, push, set, get } from 'firebase/database';
import { useRouter } from 'expo-router';
import { useUser } from '../UserContext';
import AnimatedSwipeCards from '../../AnimatedSwipeCards';

const { width: viewportWidth } = Dimensions.get('window');

const Home = () => {
  const [userData, setUserData] = useState([]);
  const [loadingChatId, setLoadingChatId] = useState(null);
  const { user, setSelectedUser, getCurrentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUserId = await getCurrentUser();
      if (currentUserId) {
        // Fetch the current user details and set it to context if necessary
        const db = getDatabase();
        const userRef = ref(db, `users/${currentUserId}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const currentUserData = snapshot.val();
          setSelectedUser({ id: currentUserId, ...currentUserData });
        }
      }
    };

    fetchCurrentUser();

    const fetchData = async () => {
      try {
        const db = getDatabase();
        const snapshot = await get(ref(db, 'users'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const users = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          setUserData(users);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    };

    fetchData();
  }, [getCurrentUser, setSelectedUser]);

  const handlePress = async (clickedUserId) => {
    console.log('Handling press for user:', clickedUserId);
    console.log('Current User ID:', user?.id);

    try {
      if (!user || !user.id) {
        console.error('User is not logged in or user ID is missing');
        return;
      }

      if (user.id === clickedUserId) {
        console.error('Cannot start a chat with yourself');
        return;
      }

      if (loadingChatId === clickedUserId) {
        console.log('Already processing this chat. Please wait.');
        return;
      }

      setLoadingChatId(clickedUserId);

      const chatId = await findOrCreateChat(user.id, clickedUserId);
      if (!chatId) {
        console.error('Chat ID is missing');
        setLoadingChatId(null);
        return;
      }

      console.log('Navigating to chat screen with chatId:', chatId);

      setSelectedUser({ id: clickedUserId });
      router.push({ pathname: '/message', params: { chatId, userId: clickedUserId } });

      setLoadingChatId(null);
    } catch (error) {
      console.error('Error handling press:', error);
      setLoadingChatId(null);
    }
  };

  const findOrCreateChat = async (currentUserId, userId) => {
    const db = getDatabase();
    const chatRef = ref(db, 'chats');
    let chatId = null;

    try {
      const existingChatSnapshot = await get(chatRef);
      if (existingChatSnapshot.exists()) {
        const chats = existingChatSnapshot.val();
        for (let id in chats) {
          const chat = chats[id];
          if (
            (chat.user1Id === currentUserId && chat.user2Id === userId) ||
            (chat.user1Id === userId && chat.user2Id === currentUserId)
          ) {
            chatId = id;
            break;
          }
        }
      }

      if (!chatId) {
        const newChatRef = push(chatRef);
        chatId = newChatRef.key;
        console.log('Creating new chat with ID:', chatId);
        await set(newChatRef, {
          user1Id: currentUserId,
          user2Id: userId,
          messages: [],
        });
      }
    } catch (error) {
      console.error('Error finding or creating chat:', error);
    }

    return chatId;
  };

  const renderCard = (item) => {
    const imageUri = item.profilePicture || require('../../assets/images/profile.png');

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: imageUri }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>
          {item.name}
        </Text>
        <View style={styles.icons}>
          <Pressable onPress={() => handlePress(item.id)}>
            <Image
              source={require('../../assets/icons/chats.png')}
              style={styles.icon}
            />
          </Pressable>
          <Image
            source={require('../../assets/icons/play.png')}
            style={styles.icon}
          />
        </View>
        {loadingChatId === item.id && (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedSwipeCards
        cards={userData}
        renderCard={renderCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    width: viewportWidth * 0.9,
    height: viewportWidth * 1.5,
    position: 'relative',
  },
  profileImage: {
    height: '80%',
    width: '100%',
    borderRadius: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 12,
    color: '#FE3C72', // Pink color
    fontFamily: 'Poppins-Bold', // Apply the custom font
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 12,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
});

export default Home;

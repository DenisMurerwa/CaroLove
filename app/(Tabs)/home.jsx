import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, Pressable } from 'react-native';
import { get, ref } from 'firebase/database';
import { useRouter } from 'expo-router';
import { database } from '../../firebase'; // Adjust path based on your folder structure
import AnimatedSwipeCards from '../../AnimatedSwipeCards'; // Adjust path to your AnimatedSwipeCards wrapper
import { useUser } from '../UserContext'; // Import the useUser hook

const { width: viewportWidth } = Dimensions.get('window');

const Home = () => {
  const [userData, setUserData] = useState([]);
  const { setSelectedUser } = useUser(); // Destructure setSelectedUser from context
  const router = useRouter(); // Hook for routing

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, 'users'));
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
  }, []);

  const handleYup = (card) => {
    console.log('Card swiped up:', card);
  };

  const handleNope = (card) => {
    console.log('Card swiped down:', card);
  };

  const handlePress = (userId) => {
    setSelectedUser(userId); // Set the selected user in context
    router.push('/message'); // Navigate to Messages page
  };

  const renderCard = (item) => {
    const imageUri = item.profilePicture || require('../../assets/images/profile.png');
  
    return (
      <View style={{
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        width: viewportWidth * 0.9,
        height: viewportWidth * 1.5,
      }}>
        <Image
          source={{ uri: imageUri }}
          style={{
            height: '80%',
            width: '100%',
            borderRadius: 15,
          }}
          onError={() => setImageUri(require('../../assets/images/profile.png'))}
        />
        <Text style={{
          fontSize: 22,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 12,
        }}>
          {item.name}
        </Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 20,
        }}>
          <Pressable onPress={() => handlePress(item.id)}>
            <Image
              source={require('../../assets/icons/chats.png')}
              style={{
                width: 40,
                height: 40,
                marginHorizontal: 12,
              }}
            />
          </Pressable>
          <Image
            source={require('../../assets/icons/play.png')}
            style={{
              width: 40,
              height: 40,
              marginHorizontal: 12,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
      <AnimatedSwipeCards
        cards={userData}
        renderCard={renderCard}
        handleYup={handleYup}
        handleNope={handleNope}
      />
    </View>
  );
};

export default Home;

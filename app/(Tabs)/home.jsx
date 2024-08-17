// Home.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { get, ref } from 'firebase/database';
import { database } from '../../firebase'; // Adjust path based on folder structure
import AnimatedSwipeCards from '../../AnimatedSwipeCards'; // Path to the wrapper

const { width: viewportWidth } = Dimensions.get('window');

const Home = () => {
  const [userData, setUserData] = useState([]);

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

  const renderCard = (item) => {
    const imageUri = item.profilePicture || require('../../assets/images/profile.png'); // Adjust as needed

    return (
      <View style={{
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        width: viewportWidth * 0.9, // Increase card width
        height: viewportWidth * 1.5, // Increase card height
      }}>
        <Image
          source={{ uri: imageUri }}
          style={{
            height: '80%', // Adjust image height
            width: '100%',
            borderRadius: 15,
          }}
          onError={() => setImageUri(require('../../assets/images/profile.png'))} // Fix image loading issues
        />
        <Text style={{
          fontSize: 22, // Increase font size
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
          <Image
            source={require('../../assets/icons/chats.png')}
            style={{
              width: 40, // Increase icon size
              height: 40,
              marginHorizontal: 12,
            }}
          />
          <Image
            source={require('../../assets/icons/play.png')}
            style={{
              width: 40, // Increase icon size
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

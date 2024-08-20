import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Link } from 'expo-router'; // Import Link for navigation

const MenuDrawer = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const db = getDatabase();
      const userRef = ref(db, `users/${currentUser.uid}`);

      const unsubscribe = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        setUser(userData);
      });

      return () => unsubscribe(); // Clean up listener on unmount
    }
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top section with profile info */}
      <View style={styles.profileSection}>
        {/* Profile picture */}
        <Image
          source={{ uri: user.profilePicture || 'https://via.placeholder.com/50' }} // Fallback image
          style={styles.avatar}
        />
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userNumber}>{user.phoneNumber}</Text>
        </View>
      </View>

      {/* Menu items */}
      <View style={styles.menuItems}>
        <Link href="/(Tabs)/home" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="home" size={24} color="#FE3C72" style={styles.icon} />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="cog" size={24} color="#FE3C72" style={styles.icon} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(Tabs)/profile" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="user" size={24} color="#FE3C72" style={styles.icon} />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
        </Link>
        
        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => console.log('Logout Pressed')} // Replace with actual logout functionality
        >
          <Icon name="sign-out" size={24} color="#FE3C72" style={styles.icon} />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    backgroundColor: '#FE3C72',
    padding: 16,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular image
    marginRight: 16,
    backgroundColor: '#ccc', // Placeholder color if no image is available
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userNumber: {
    color: '#fff',
  },
  menuItems: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#FE3C72',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#FE3C72',
    marginVertical: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
});

export default MenuDrawer;

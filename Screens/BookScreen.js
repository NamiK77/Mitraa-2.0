import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VenueCard from '../components/VenueCard';
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const BookScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:8000/venues');
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 12,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Text style={{ fontSize: 16, fontWeight: '500' }}>BookScreen</Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <Ionicons name="chatbox-outline" size={24} color="black" />
          <Ionicons name="notifications-outline" size={24} color="black" />

          <Pressable
            onPress={() => navigation.navigate('ProfileDetail')}
            style={styles.profileImageContainer}>
             <Image
                style={styles.profileImage}
                source={{
                  uri: user?.user?.image || 'https://via.placeholder.com/60',
                }}
            />
          </Pressable>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 12,
          backgroundColor: '#E8E8E8',
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 25,
        }}>
        <TextInput placeholder="Search For Venues" />
        <Ionicons name="search" size={24} color="gray" />
      </View>

      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          padding: 13,
        }}>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            borderColor: '#E0E0E0',
            borderWidth: 2,
          }}>
          <Text>Sports & Availabilty</Text>
        </View>

        <View
          style={{
            padding: 10,
            borderRadius: 10,
            borderColor: '#E0E0E0',
            borderWidth: 2,
          }}>
          <Text>Favorites</Text>
        </View>

        <View
          style={{
            padding: 10,
            borderRadius: 10,
            borderColor: '#E0E0E0',
            borderWidth: 2,
          }}>
          <Text>Offers</Text>
        </View>
      </Pressable>

      
    </SafeAreaView>
  );
};

export default BookScreen;

const styles = StyleSheet.create({
  profileImageContainer: {
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#D397F8',
  },
});

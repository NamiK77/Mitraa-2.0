import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import Game from '../components/Game';
import {AuthContext} from '../AuthContext';
import UpComingGame from '../components/UpComingGame';

const PlayScreen = () => {
  // const [option, setOption] = useState('My Sports');
  const [sport, setSport] = useState('Badminton');
  const navigation = useNavigation();
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [games, setGames] = useState('');

  const route = useRoute();

  const [user, setUser] = useState('');

  const initialOption = route.params?.initialOption || 'My Sports';
  const [option, setOption] = useState(initialOption);

  useEffect(() => {
    if (initialOption) {
      setOption(initialOption);
    }
  }, [initialOption]);

  const {userId} = useContext(AuthContext);

  console.log('useriD', userId);

  useEffect(() => {
    fetchGames();
  }, []);

  console.log('games', games);

  
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchGames();
      }
    }, [userId]),
  );
  return (
    <SafeAreaView>
      <View style={{padding: 12, backgroundColor: '#570987'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Text style={{fontSize: 16, fontWeight: '500', color: 'white'}}>
              Play Screen
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            <Ionicons name="chatbox-outline" size={24} color="white" />
            <Ionicons name="notifications-outline" size={24} color="white" />

            <Pressable onPress={() => navigation.navigate('ProfileDetail')}>
              <Image
                style={{width: 30, height: 30, borderRadius: 15}}
                source={{
                  uri: user?.user?.image,
                }}
              />
            </Pressable>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginVertical: 14,
          }}>
          <Pressable onPress={() => setOption('Calendar')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'Calendar' ? '#D397F8' : 'white',
                fontSize: 15,
              }}>
              Calendar
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('My Sports')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'My Sports' ? '#D397F8' : 'white',
                fontSize: 15,
              }}>
              My Sports
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('Other Sports')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'Other Sports' ? '#D397F8' : 'white',
                fontSize: 15,
              }}>
              Other Sports
            </Text>
          </Pressable>
        </View>

        <View style={{marginVertical: 7}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Pressable
              onPress={() => setSport('Badminton')}
              style={{
                padding: 10,
                borderColor: 'white',
                borderWidth: sport == 'Badminton' ? 0 : 1,
                marginRight: 10,
                borderRadius: 8,
                backgroundColor:
                  sport == 'Badminton' ? '#7D0DC3' : 'transparent',
              }}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Badminton
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSport('Cricket')}
              style={{
                padding: 10,
                borderColor: 'white',
                borderWidth: sport == 'Cricket' ? 0 : 1,
                marginRight: 10,
                borderRadius: 8,
                backgroundColor: sport == 'Cricket' ? '#7D0DC3' : 'transparent',
              }}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Cricket
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSport('Cycling')}
              style={{
                padding: 10,
                borderColor: 'white',
                borderWidth: sport == 'Cycling' ? 0 : 1,
                marginRight: 10,
                borderRadius: 8,
                backgroundColor: sport == 'Cycling' ? '#7D0DC3' : 'transparent',
              }}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Cycling
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSport('Running')}
              style={{
                padding: 10,
                borderColor: 'white',
                borderWidth: sport == 'Running' ? 0 : 1,
                marginRight: 10,
                borderRadius: 8,
                backgroundColor: sport == 'Running' ? '#7D0DC3' : 'transparent',
              }}>
              <Text style={{color: 'white', fontWeight: '600', fontSize: 15}}>
                Running
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 12,
          backgroundColor: 'white',
        }}>
        <Pressable onPress={() => navigation.navigate('Create')}>
          <Text style={{fontWeight: 'bold'}}>Create Game</Text>
        </Pressable>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
          <Pressable>
            <Text style={{fontWeight: 'bold'}}>Filter</Text>
          </Pressable>

          <Pressable>
            <Text style={{fontWeight: 'bold'}}>Sort</Text>
          </Pressable>
        </View>
      </View>

      {option == 'My Sports' && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={games}
          contentContainerStyle={{ paddingBottom: 200 }}
          keyExtractor={item => item._id}
          renderItem={({item}) => <Game item={item} />}
        />
      )}

      {option == 'Calendar' && (
        <FlatList
          data={upcomingGames}
          keyExtractor={item => item._id}
          renderItem={({item}) => <UpComingGame item={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default PlayScreen;

const styles = StyleSheet.create({});

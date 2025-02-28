import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {NavigationContainer} from '@react-navigation/native';

// import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../Screens/HomeScreen';
import PlayScreen from '../Screens/PlayScreen';
import BookScreen from '../Screens/BookScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import VenueInfoScreen from '../Screens/VenueInfoScreen';

import LoginScreen from '../Screens/LoginScreen';
import StartScreen from '../Screens/StartScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import PasswordScreen from '../Screens/PasswordScreen';
import NameScreen from '../Screens/NameScreen';
import SelectImage from '../Screens/SelectImage';
import PreFinalScreen from '../Screens/PreFinalScreen';
import {AuthContext} from '../AuthContext';
import CreateActivity from '../Screens/CreateActivity';
import TagVenueScreen from '../Screens/TagVenueScreen';
import SelectTimeScreen from '../Screens/SelectTimeScreen';
import GameSetUpScreen from '../Screens/GameSetUpScreen';
import PlayersScreen from '../Screens/PlayersScreen';
import ManageRequests from '../Screens/ManageRequests';
import ProfileDetailScreen from '../Screens/ProfileDetailScreen';
import SlotScreen from '../Screens/SlotScreen';
import PaymentScreen from '../Screens/PaymentScreen';

// import OtpScreen from '../Screens/OtpScreen';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const {isLoading, token} = useContext(AuthContext);

  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="HOME"
          component={HomeScreen}
          options={{
            headerShown: false, // Explicitly hide header for Home screen
            tabBarActiveTintColor: '#D397F8',
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons name="home-outline" size={24} color="#570987" />
              ) : (
                <Ionicons name="home-outline" size={24} color="#989898" />
              ),
          }}
        />

        <Tab.Screen
          name="PLAY"
          component={PlayScreen}
          options={{
            tabBarActiveTintColor: '#D397F8',
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <AntDesign name="addusergroup" size={24} color="#570987" />
              ) : (
                <AntDesign name="addusergroup" size={24} color="#989898" />
              ),
          }}
        />
        <Tab.Screen
          name="BOOK"
          component={BookScreen}
          options={{
            tabBarActiveTintColor: '#D397F8',
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <SimpleLineIcons name="book-open" size={24} color="#570987" />
              ) : (
                <SimpleLineIcons name="book-open" size={24} color="#989898" />
              ),
          }}
        />
        <Tab.Screen
          name="PROFILE"
          component={ProfileScreen}
          options={{
            tabBarActiveTintColor: '#D397F8',
            headerShown: false,
            tabBarIcon: ({focused}) =>
              focused ? (
                <Ionicons name="person-outline" size={24} color="#570987" />
              ) : (
                <Ionicons name="person-outline" size={24} color="#989898" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }

  const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Password"
          component={PasswordScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Name"
          component={NameScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Image"
          component={SelectImage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PreFinal"
          component={PreFinalScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  };

  function MainStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Venue"
          component={VenueInfoScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Create"
          component={CreateActivity}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="TagVenue"
          component={TagVenueScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen name="Time" component={SelectTimeScreen} />
        <Stack.Screen
          name="ProfileDetail"
          component={ProfileDetailScreen}
          options={{headerShown: false}} // Hide header for ProfileDetailScreen
        />

        <Stack.Screen
          name="Game"
          component={GameSetUpScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Slot"
          component={SlotScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Players"
          component={PlayersScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Manage"
          component={ManageRequests}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  // if (isLoading) {
  //   return <SplashScreen />;
  // }

  return (
    <NavigationContainer>
      {token === null || token === '' ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});

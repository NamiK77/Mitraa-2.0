import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { NavigationContainer, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../AuthContext";

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const total = route.params.price + 8.8;
  console.log(route?.params);

  const { userId } = useContext(AuthContext);
  const [isMounted, setIsMounted] = useState(true);
  
  const courtNumber = route.params.selectedCourt 
  const date = route.params.selectedDate;
  const time = route.params.selectedTime;
  const name = route.params.place
  const game = route.params?.gameId;

  console.log("Game",game)

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  const bookSlot = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:8000/book', {
        courtNumber: route.params.selectedCourt,
        date: route.params.selectedDate,
        time: route.params.selectedTime,
        userId,
        name: route.params.place,
        game: route.params?.gameId,
      });
  
      if (response.status === 200) {
        console.log('Booking successful:', response.data);
        navigation.replace("Main");
      } else {
        console.error('Booking failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error booking slot:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data.message === 'Slot already booked') {
        if (isMounted) {
          Alert.alert("Booking Error", "Slot already booked");
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    }
  };
  return (
    <>
    <ScrollView style={{marginTop:50}}>
      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 23, fontWeight: "500", color: "#A020F0" }}>
          {route.params.selectedSport}
        </Text>

        <View
          style={{
            borderColor: "#E0E0E0",
            borderWidth: 1,
            padding: 10,
            marginTop: 10,
            borderRadius: 6,
            shadowColor: "#171717",
            shadowOffset: { width: -1, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
          }}
        >
          <View>
            <View
              style={{
                marginVertical: 3,
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
              }}
            >
              <MaterialCommunityIcons
                name="fireplace-off"
                size={20}
                color="black"
              />
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#570987" }}>
                {route.params.selectedCourt}
              </Text>
            </View>
            <View
              style={{
                marginVertical: 3,
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Feather name="calendar" size={20} color="black" />
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#570987" }}>
                {route.params.selectedDate}
              </Text>
            </View>
            <View
              style={{
                marginVertical: 3,
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Feather name="clock" size={20} color="black" />
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#570987" }}>
                {route.params.selectedTime}
              </Text>
            </View>
            <View
              style={{
                marginVertical: 3,
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
              }}
            >
              <MaterialCommunityIcons
                name="currency-rupee"
                size={20}
                color="black"
              />
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#570987" }}>
              Nrs {route.params.price}
              </Text>
            </View>
          </View>

          <Pressable></Pressable>
        </View>
      </View>

      <View style={{ marginTop: 15, marginHorizontal: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
          >
            <Text>Court Price</Text>
            <EvilIcons name="question" size={24} color="black" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>
          Nrs {route.params.price}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginTop: 15,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
          >
            <Text>Convenience Fee</Text>
            <EvilIcons name="question" size={24} color="black" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>Nrs 8.8</Text>
        </View>
      </View>
      <Text
        style={{
          height: 1,
          borderColor: "#E0E0E0",
          borderWidth: 3,
          marginTop: 20,
        }}
      />

      <View
        style={{
          marginHorizontal: 15,
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",

          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500", color: "#A020F0" }}>Total Amount</Text>
        <Text style={{ fontSize: 15, fontWeight: "500", color: "#A020F0" }}>
          {total}
        </Text>
      </View>

      <View
        style={{
          marginHorizontal: 15,
          marginTop: 10,
          borderColor: "#C0C0C0",
          borderWidth: 2,
          padding: 8,
          borderRadius: 6,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",

            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16 }}>Total Amount</Text>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            To be paid at Venue
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16 }}>Nrs {total}</Text>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>{total}</Text>
        </View>
      </View>
      <Text
        style={{
          height: 1,
          borderColor: "#E0E0E0",
          borderWidth: 3,
          marginTop: 20,
        }}
      />
      <View
        style={{ marginLeft: "auto", marginRight: "auto", marginTop: 20 }}
      >
        <Image
          style={{ width: 400, height: 180, resizeMode: "contain" }}
          source={require('../images/Logo.png')}
        />
      </View>
    </ScrollView>

    <Pressable
    onPress={bookSlot}
      style={{
        backgroundColor: "#A020F0",
        padding: 15,
        marginBottom: 30,
        borderRadius: 6,
        marginHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 17, fontWeight: "500", color: "white" }}>
        Nrs {total}
      </Text>
      <Text style={{ fontSize: 17, fontWeight: "500", color: "white" }}>
        Proceed to Pay
      </Text>
    </Pressable>
  </>
  )
}

export default PaymentScreen

const styles = StyleSheet.create({})
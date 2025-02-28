import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { getRegistrationProgress, saveRegistrationProgress } from '../registrationUtils';

const SelectImage = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState();
  const images = [
    {
      id: '0',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK6R1z3qZSvxlDr8h6KP5JXLzdojVQySeVGA&s',
    },
    {
      id: '0',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz3gMQva16MA1vQpmnhhrYQZi8zqLuVCeKgg&s',
    },
    {
      id: '0',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmJXTAuHsH2reqGwvLy3QXY51tHGryq1TYFQ&s',
    },
    {
      id: '0',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX4-AttQO82GkCLLt0pSy1aHSxTWAJvBcFwA&s',
    },
  ];


  useEffect(() => {
    getRegistrationProgress('Image').then(progressData => {
      if (progressData) {
        setImage(progressData.image || '');
      }
    });
  }, []);

  const saveImage = () => {
    if (image.trim() !== '') {
      saveRegistrationProgress('Image', {image});
    }
    navigation.navigate('PreFinal');
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{marginHorizontal: 10}}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
        </View>

        <View style={{marginHorizontal: 10, marginVertical: 15}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            Complete Your Profile
          </Text>

          <Text style={{marginTop: 10, color: 'gray'}}>
            What would you like your mates to call you? 
          </Text>
        </View>

        <View style={{marginVertical: 25}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderColor: 'green',
                borderWidth: 2,
                resizeMode: 'cover',
              }}
              source={{uri: image ? image : images[1]?.image}}
            />
          </View>
          

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 25,
              justifyContent: 'center',
            }}>
            {images?.map((item, index) => (
              <Pressable
                onPress={() => setImage(item?.image)}
                style={{margin: 10, gap: 10}}
                key={index}>
                <Image
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    borderColor:
                      image == item?.image ? 'green' : 'transparent',
                    borderWidth: 2,
                    resizeMode: 'contain',
                  }}
                  source={{uri: item.image}}
                />
              </Pressable>
            ))}
          </View>

          <Text style={{textAlign: 'center', color: 'gray', fontSize: 17}}>
            OR
          </Text>
          <View style={{marginHorizontal: 20, marginVertical: 20}}>
            <View>
              <Text style={{fontSize: 16, color: 'gray'}}>
                Enter Image link
              </Text>

              <TextInput
                value={image}
                onChangeText={setImage}
                placeholder="Image link"
                style={{
                  padding: 18,
                  borderColor: '#D0D0D0',
                  borderWidth: 1,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <Pressable
        onPress={saveImage}
        style={{
          backgroundColor: '#570987',
          marginTop: 'auto',
          marginBottom: 30,
          padding: 15,
          marginHorizontal: 10,
          borderRadius: 4,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: 15,
            fontWeight: '500',
          }}>
          NEXT
        </Text>
      </Pressable>
    </>
  );
};

export default SelectImage;

const styles = StyleSheet.create({});

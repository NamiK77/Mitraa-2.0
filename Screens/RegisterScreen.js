import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInputBase,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  getRegistrationProgress,
  saveRegistrationProgress,
} from '../registrationUtils';

const RegisterScreen = () => {
  
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    getRegistrationProgress('Register').then(progressData => {
      if (progressData) {
        setEmail(progressData.email || '');
      }
    });
  }, []);
  const next = () => {
    if (email.trim() !== '') {
      if (email.trim() !== '') {
        saveRegistrationProgress('Register', {email});
      }
    }

    navigation.navigate('Password');
  };
  // useEffect(() => {
  //   getRegistrationProgress('Register').then(progressData => {
  //     if (progressData) {
  //       setEmail(progressData.email || '');
  //     }
  //   });
  // }, []);

  return (
    <SafeAreaView>
      <View style={{padding: 13}}>
        <Text style={{fontSize: 16, fontWeight: '500'}}>
          You're Almost There
        </Text>

        <View style={{flexDirection: 'column', gap: 16, marginVertical: 40}}>
          <Text style={{fontSize: 16, color: 'gray'}}>Enter Email</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            style={{
              padding: 15,
              borderColor: '#D0D0D0',
              borderWidth: 1,
              borderRadius: 10,
            }}
          />

          <Pressable
            onPress={next}
            style={{
              padding: 15,
              backgroundColor: email?.length > 4 ? '#570987' : '#E0E0E0',
              borderRadius: 8,
            }}>
            <Text style={{textAlign: 'center'}}>Next</Text>
          </Pressable>
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{textAlign: 'center', fontWeight: '500', fontSize: 15}}>
            I agree to receive updates over Whatsapp
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: 'gray',
              textAlign: 'center',
              marginTop: 20,
            }}>
            By Signing up, you agree to the Terms of Service and Privacy and
            Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});

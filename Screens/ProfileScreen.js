import {StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Alert, Image} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../AuthContext';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const ProfileScreen = () => {
  const {logout, userId} = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:8000/user/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const handleProfilePress = () => {
    navigation.navigate('ProfileDetail');
  };

  const handleAddVenue = () => {
    navigation.navigate('AddVenue');
  };

  const handleSkillsPress = () => {
    navigation.navigate('Skills'); // Ensure this navigates to the Skills screen
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <ScrollView>
        {/* User Image and Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <TouchableOpacity onPress={handleProfilePress} style={styles.profileContainer}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: user?.image || 'https://via.placeholder.com/80',
                }}
              />
              <Text style={styles.welcomeText}>
                Welcome, {user?.firstName || 'User'}!
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{padding: 12}}>
          {/* First Section - Add this new item at the top */}
          <View style={{backgroundColor: 'white', padding: 10, borderRadius: 10, marginBottom: 12}}>
            <TouchableOpacity 
              onPress={handleAddVenue}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons name="add-business" size={24} color={'#570987'} />
              </View>

              <View>
                <Text style={{fontSize: 16, fontWeight: '500'}}>Add Venue</Text>
                <Text style={{marginTop: 7, color: 'gray'}}>
                  Register your sports venue
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Skills Section */}
          <View style={{backgroundColor: 'white', padding: 10, borderRadius: 10, marginBottom: 12}}>
            <TouchableOpacity 
              onPress={handleSkillsPress} // Use the handleSkillsPress function
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons name="school" size={24} color={'#570987'} />
              </View>

              <View>
                <Text style={{fontSize: 16, fontWeight: '500'}}>Skills</Text>
                <Text style={{marginTop: 7, color: 'gray'}}>
                  View and manage your skills
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* First Section */}
          <View style={{backgroundColor: 'white', padding: 10, borderRadius: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name="calendar" size={24} color={'#570987'} />
              </View>

              <View>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  My Bookings
                </Text>
                <Text style={{marginTop: 7, color: 'gray'}}>
                  View Transactions & Receipts
                </Text>
              </View>
            </View>

            <View
              style={{
                height: 1,
                borderColor: '#E0E0E0',
                borderWidth: 0.5,
                marginTop: 15,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginVertical: 15,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="people-outline" size={24} color={'#570987'} />
              </View>

              <View>
                <Text style={{fontSize: 16, fontWeight: '500'}}>Playpals</Text>
                <Text style={{marginTop: 7, color: 'gray'}}>
                  View & Manage Players
                </Text>
              </View>
            </View>

            <View
              style={{height: 1, borderColor: '#E0E0E0', borderWidth: 0.5}}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 15,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name="book" size={24} color={'#570987'} />
              </View>

              <View>
                <Text style={{fontSize: 16, fontWeight: '500'}}>Passbook</Text>
                <Text style={{marginTop: 7, color: 'gray'}}>
                  Manage Karma,Playo credits, etc
                </Text>
              </View>
            </View>

            <View
              style={{
                height: 1,
                borderColor: '#E0E0E0',
                borderWidth: 0.5,
                marginTop: 15,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 15,
                marginBottom: 10,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#E0E0E0',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons
                  name="energy-savings-leaf"
                  size={24}
                  color={'#570987'}
                />
              </View>

              <View>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Preference and Privacy
                </Text>
                <Text style={{marginTop: 7, color: 'gray'}}>
                  View Transactions & Receipts
                </Text>
              </View>
            </View>
          </View>

          {/* Second Section */}
          <View style={{padding: 12}}>
            <View style={{backgroundColor: 'white', padding: 10, borderRadius: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#E0E0E0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AntDesign name="calendar" size={24} color={'#570987'} />
                </View>

                <View>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>Offers</Text>
                </View>
              </View>

              <View
                style={{
                  height: 1,
                  borderColor: '#E0E0E0',
                  borderWidth: 0.5,
                  marginTop: 15,
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginVertical: 15,
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#E0E0E0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Ionicons name="people-outline" size={24} color={'#570987'} />
                </View>

                <View>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>Blogs</Text>
                </View>
              </View>

              <View
                style={{height: 1, borderColor: '#E0E0E0', borderWidth: 0.5}}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 10,
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#E0E0E0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <AntDesign name="book" size={24} color={'#570987'} />
                </View>

                <View>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>
                    Invite & Earn
                  </Text>
                </View>
              </View>

              <View
                style={{
                  height: 1,
                  borderColor: '#E0E0E0',
                  borderWidth: 0.5,
                  marginTop: 15,
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 15,
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#E0E0E0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialIcons
                    name="energy-savings-leaf"
                    size={24}
                    color={'#570987'}
                  />
                </View>

                <View>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>
                    Help & Support
                  </Text>
                </View>
              </View>

              <View
                style={{height: 1, borderColor: '#E0E0E0', borderWidth: 0.5}}
              />

              {/* Logout Button */}
              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 15,
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#E0E0E0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialIcons
                    name="logout"
                    size={24}
                    color={'#570987'}
                  />
                </View>

                <View>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    backgroundColor: '#570987',
    padding: 20,
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#D397F8',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
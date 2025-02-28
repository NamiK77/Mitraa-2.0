import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Image,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import Logo from '../images/Logo.png';

const ManageRequests = () => {
  const [option, setOption] = useState('Requests');
  const route = useRoute();
  const navigation = useNavigation();

  const userId = route?.params?.userId;
  const gameId = route?.params?.gameId;

  const [requests, setRequests] = useState([]);
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchRequests();
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (option === 'Chat') {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [option]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const response = await axios.post('http://10.0.2.2:8000/messages', {
        gameId: gameId,
        userId: userId,
        message: newMessage.trim()
      });

      if (response.status === 200) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/messages/${gameId}`,
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const acceptRequest = async userId => {
    try {
      const user = {
        gameId: gameId,
        userId: userId,
      };
      const response = await axios.post('http://10.0.2.2:8000/accept', user);

      if (response.status === 200) {
        Alert.alert('Success', 'Request accepted');
        await fetchRequests();
        await fetchPlayers();
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const rejectRequest = async userId => {
    try {
      const user = {
        gameId: gameId,
        userId: userId,
      };
      const response = await axios.post('http://10.0.2.2:8000/reject', user);

      if (response.status === 200) {
        Alert.alert('Success', 'Request rejected');
        await fetchRequests();
        await fetchPlayers();
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/games/${gameId}/requests`,
      );
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8000/game/${gameId}/players`,
      );
      setPlayers(response.data);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: 12, backgroundColor: '#570987'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            justifyContent: 'space-between',
          }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="White"
          />
          <AntDesign name="plussquareo" size={24} color="white" />
        </View>

        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
            Manage Players
          </Text>

          <View>
            <Text style={{color: 'white', fontSize: 17}}>Match Full</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 15,
          }}>
          <Pressable onPress={() => setOption('Requests')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'Requests' ? '#D397F8' : 'white',
              }}>
              Requests ({requests?.length})
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('Invited')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'Invited' ? '#D397F8' : 'white',
              }}>
              Invited (0)
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('Playing')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'Playing' ? '#D397F8' : 'white',
              }}>
              Playing({players?.length})
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('Chat')}>
            <Text
              style={{
                fontWeight: '500',
                color: option == 'Chat' ? '#D397F8' : 'white',
              }}>
              Chat({players?.length})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Requests Section */}
      {option == 'Requests' && (
        <ScrollView style={{marginTop: 10, marginHorizontal: 15}}>
          {requests?.map((item, index) => (
            <Pressable
              key={index}
              style={{
                padding: 10,
                backgroundColor: 'white',
                marginVertical: 10,
                borderRadius: 6,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 13,
                }}>
                <Image
                  style={{width: 50, height: 50, borderRadius: 25}}
                  source={{uri: item?.image}}
                />

                <View style={{flex: 1}}>
                  <Text style={{fontWeight: '600'}}>
                    {item?.firstName} {item?.lastName}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      marginTop: 10,
                      borderRadius: 20,
                      borderColor: 'orange',
                      borderWidth: 1,
                      alignSelf: 'flex-start',
                    }}>
                    <Text style={{fontSize: 13}}>INTERMEDIATE</Text>
                  </View>
                </View>

                <View>
                  <Image
                    style={{width: 110, height: 60, resizeMode: 'contain'}}
                    source={Logo}
                  />
                </View>
              </View>

              <Text style={{marginTop: 8}}>{item?.comment}</Text>

              <View
                style={{
                  height: 1,
                  borderColor: '#E0E0E0',
                  borderWidth: 0.7,
                  marginVertical: 15,
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      backgroundColor: '#E0E0E0',
                      borderRadius: 5,
                      alignSelf: 'flex-start',
                    }}>
                    <Text style={{fontSize: 14, color: 'gray'}}>
                      0 NO SHOWS
                    </Text>
                  </View>

                  <Text
                    style={{
                      marginTop: 10,
                      fontWeight: 'bold',
                      textDecorationLine: 'underline',
                    }}>
                    See Reputation
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}>
                  <Pressable
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      borderColor: '#E0E0E0',
                      borderWidth: 1,
                      width: 100,
                      backgroundColor: 'red',
                    }}
                    onPress={() => rejectRequest(item.userId)}>
                    <Text style={{textAlign: 'center', color: 'white'}}>REJECT</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => acceptRequest(item.userId)}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      backgroundColor: '#570987',
                      width: 100,
                    }}>
                    <Text style={{textAlign: 'center', color: 'white'}}>
                      ACCEPT
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Playing Section */}
      {option == 'Playing' && (
        <ScrollView style={{marginTop: 10, marginHorizontal: 15}}>
          {players?.map((item, index) => (
            <Pressable
              key={index}
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                justifyContent: 'space-between',
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 8,
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                <View>
                  <Image
                    style={{width: 60, height: 60, borderRadius: 30}}
                    source={{uri: item?.image}}
                  />
                </View>

                <View>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>
                    {item?.firstName} {item?.lastName}
                  </Text>

                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginTop: 10,
                      borderRadius: 20,
                      borderColor: 'orange',
                      borderWidth: 1,
                      alignSelf: 'flex-start',
                    }}>
                    <Text style={{fontSize: 13, fontWeight: '400'}}>
                      INTERMEDIATE
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Chat Section */}
      {option == 'Chat' && (
        <View style={{flex: 1, padding: 10}}>
          <View style={styles.chatContainer}>
            <ScrollView style={styles.messagesContainer}>
              {messages.map((msg, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBox,
                    msg.userId._id === userId ? styles.sentMessage : styles.receivedMessage,
                  ]}>
                  <Text style={[
                    styles.senderName,
                    msg.userId._id === userId ? styles.sentSenderName : styles.receivedSenderName,
                  ]}>
                    {msg.userId._id === userId ? 'You' : `${msg.userId.firstName} ${msg.userId.lastName}`}
                  </Text>
                  <Text style={[
                    styles.messageText,
                    msg.userId._id === userId ? styles.sentMessageText : styles.receivedMessageText,
                  ]}>
                    {msg.message}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    msg.userId._id === userId ? styles.sentMessageTime : styles.receivedMessageTime,
                  ]}>
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message..."
                placeholderTextColor="#666"
              />
              <Pressable onPress={sendMessage} style={styles.sendButton}>
                <Ionicons name="send" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ManageRequests;

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageBox: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#570987',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  senderName: {
    fontSize: 12,
    marginBottom: 2,
  },
  sentSenderName: {
    color: '#D397F8',
  },
  receivedSenderName: {
    color: '#666',
  },
  messageText: {
    fontSize: 14,
  },
  sentMessageText: {
    color: 'white',
  },
  receivedMessageText: {
    color: 'black',
  },
  messageTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  sentMessageTime: {
    color: '#D397F8',
  },
  receivedMessageTime: {
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    color: 'black',
  },
  sendButton: {
    backgroundColor: '#570987',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
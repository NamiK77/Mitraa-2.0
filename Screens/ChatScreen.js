import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';

const ChatScreen = ({ route }) => {
  const { userId, chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    // Fetch chat history when component mounts
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:8000/chat/${chatId}`); // Ensure the URL is correct
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (currentMessage.trim()) {
      try {
        const response = await axios.post(`http://10.0.2.2:8000/chat/${chatId}/message`, { // Ensure the URL is correct
          senderId: userId,
          text: currentMessage,
          image: '', // Add image URL if needed
        });
        setMessages([...messages, response.data]);
        setCurrentMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={item.sender === userId ? styles.userMessage : styles.adminMessage}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item._id}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  adminMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ffc7',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default ChatScreen;
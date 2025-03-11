import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../AuthContext';

const NotificationScreen = ({ navigation }) => {
  const { userId } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    } else {
      console.error('userId is not defined');
      setLoading(false);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    // Simulate fetching notifications
    setTimeout(() => {
      const mockNotifications = [
        { _id: '1', message: 'New join request from user 123', type: 'request', createdAt: '2023-03-01T10:00:00Z', read: false },
        { _id: '2', message: 'Your request was accepted', type: 'accept', createdAt: '2023-03-01T11:00:00Z', read: false },
      ];
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <Icon name={item.type === 'request' ? 'person-add' : 'check-circle'} size={24} color={item.type === 'request' ? '#ff9800' : '#4caf50'} />
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationText, item.read && styles.readNotification]}>{item.message}</Text>
        <Text style={styles.notificationTimestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markAllRead}>Mark All as Read</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  markAllRead: {
    fontSize: 14,
    color: '#007bff',
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationContent: {
    marginLeft: 16,
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  readNotification: {
    color: '#757575',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
});
import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, RefreshControl, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const NotificationScreen = ({ navigation }) => {
  const { userId } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    } else {
      console.error('userId is not defined');
      setLoading(false);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/notifications?userId=${userId}`);
      console.log('Fetched notifications:', response.data); // Add this line for logging
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setLoading(false);
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications().then(() => setRefreshing(false));
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <Image source={{ uri: item.userId.image }} style={styles.notificationImage} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>
          {item.userId.firstName} {item.userId.lastName}
        </Text>
        <Text style={[styles.notificationText, item.read && styles.readNotification]}>
          {item.message}
        </Text>
        <Text style={styles.notificationTimestamp}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
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
          {notifications.some(notification => !notification.read) && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {notifications.filter(notification => !notification.read).length}
              </Text>
            </View>
          )}
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  notificationContent: {
    marginLeft: 16,
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationText: {
    fontSize: 14,
    color: '#555',
  },
  readNotification: {
    color: '#757575',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  unreadBadge: {
    backgroundColor: 'red',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
import React, { useEffect, useState, useContext } from 'react';
import { 
  View, Text, FlatList, ActivityIndicator, StyleSheet, 
  TouchableOpacity, SafeAreaView, StatusBar, RefreshControl
} from 'react-native';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const MyBookingsScreen = () => {
  const { userId } = useContext(AuthContext);
  const [bookedGames, setBookedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchBookedGames();
  }, [userId]);

  const fetchBookedGames = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://10.0.2.2:8000/upcoming?userId=${userId}`);
      setBookedGames(res.data || []);
    } catch (error) {
      setBookedGames([]);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookedGames();
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };

  // Get sport emoji
  const getSportEmoji = (sport) => {
    if (!sport) return '🏆';
    const sportLower = sport.toLowerCase();
    if (sportLower.includes('football') || sportLower.includes('soccer')) return '⚽';
    if (sportLower.includes('basketball')) return '🏀';
    if (sportLower.includes('tennis')) return '🎾';
    if (sportLower.includes('volleyball')) return '🏐';
    return '🏆';
  };

  // Check if a game is upcoming
  const isUpcoming = (dateString) => {
    if (!dateString) return false;
    try {
      return new Date(dateString) > new Date();
    } catch (error) {
      return true;
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#6200EE" barStyle="light-content" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6200EE" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.headerRight} />
      </View>
      
      {/* Content */}
      <FlatList
        data={bookedGames.filter(item => item.courtNumber && item.courtNumber !== 'N/A')}
        keyExtractor={item => item._id || Math.random().toString()}
        renderItem={({ item }) => {
          const upcoming = isUpcoming(item.date);
          return (
            <View style={[styles.gameCard, upcoming ? styles.upcomingCard : styles.pastCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.sportIconContainer}>
                  <Text style={styles.sportIcon}>{getSportEmoji(item.sport)}</Text>
                </View>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>{item.sport || 'Game'}</Text>
                  <Text style={styles.gameLocation}>{item.area || 'No location'}</Text>
                </View>
                <View style={[styles.statusBadge, upcoming ? styles.upcomingBadge : styles.pastBadge]}>
                  <Text style={styles.statusText}>{upcoming ? 'Upcoming' : 'Past'}</Text>
                </View>
              </View>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{formatDate(item.date)}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailValue}>{item.time || 'Not specified'}</Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Court</Text>
                    <Text style={styles.detailValue}>{item.courtNumber || 'Not assigned'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Players</Text>
                    <Text style={styles.detailValue}>{item.totalPlayers || '0'}</Text>
                  </View>
                </View>
              </View>
              
              {upcoming && (
                <TouchableOpacity 
                  style={styles.viewDetailsButton}
                  onPress={() => navigation.navigate('GameDetails', { gameId: item._id })}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6200EE']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No Bookings Found</Text>
            <Text style={styles.emptyText}>
              You haven't booked any games yet. Browse available games to make a booking.
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigation.navigate('Play')}
            >
              <Text style={styles.browseButtonText}>Browse Games</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#6200EE',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerRight: { width: 40 },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  gameCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  upcomingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6200EE',
  },
  pastCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#9E9E9E',
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sportIcon: { fontSize: 24 },
  gameInfo: { flex: 1 },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  gameLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: { backgroundColor: '#E8F5E9' },
  pastBadge: { backgroundColor: '#EEEEEE' },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: { padding: 16 },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: { flex: 1 },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  viewDetailsButton: {
    backgroundColor: '#F0F0F7',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewDetailsText: {
    color: '#6200EE',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  browseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MyBookingsScreen;
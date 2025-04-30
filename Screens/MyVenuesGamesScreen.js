import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
  Dimensions
} from 'react-native';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');

const MyVenuesGamesScreen = () => {
  const { userId } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('games');
  const [editGameModalVisible, setEditGameModalVisible] = useState(false);
  const [editVenueModalVisible, setEditVenueModalVisible] = useState(false);
  const [gameToEdit, setGameToEdit] = useState(null);
  const [venueToEdit, setVenueToEdit] = useState(null);
  const [editGameFields, setEditGameFields] = useState({
    sport: '',
    area: '',
    date: '',
    time: '',
  });
  const [editVenueFields, setEditVenueFields] = useState({
    name: '',
    address: '',
    description: '',
  });
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user's games
      const gamesRes = await axios.get(`http://10.0.2.2:8000/api/games/user/${userId}`);
      setGames(gamesRes.data.games || []);
      // Fetch user's venues
      const venuesRes = await axios.get(`http://10.0.2.2:8000/api/venues/user/${userId}`);
      setVenues(venuesRes.data.venues || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch your games or venues.');
    }
    setLoading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDeleteGame = async (gameId) => {
    Alert.alert(
      'Delete Game',
      'Are you sure you want to delete this game?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://10.0.2.2:8000/api/games/${gameId}`, { data: { userId } });
              setGames(games.filter(g => g._id !== gameId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete game.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteVenue = async (venueId) => {
    Alert.alert(
      'Delete Venue',
      'Are you sure you want to delete this venue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://10.0.2.2:8000/api/venues/${venueId}`, { data: { userId } });
              setVenues(venues.filter(v => v._id !== venueId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete venue.');
            }
          },
        },
      ]
    );
  };

  // Update Game logic
  const handleUpdateGame = (game) => {
    setGameToEdit(game);
    setEditGameFields({
      sport: game.sport || '',
      area: game.area || '',
      date: game.date || '',
      time: game.time || '',
    });
    setEditGameModalVisible(true);
  };

  const handleSaveGameUpdate = async () => {
    try {
      // Validate inputs
      if (!editGameFields.sport || !editGameFields.area || !editGameFields.date || !editGameFields.time) {
        Alert.alert('Validation Error', 'All fields are required');
        return;
      }
      
      const res = await axios.put(
        `http://10.0.2.2:8000/api/games/${gameToEdit._id}`,
        { ...editGameFields, userId }
      );
      
      setGames(games.map(g => (g._id === gameToEdit._id ? res.data.game : g)));
      setEditGameModalVisible(false);
      setGameToEdit(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update game.');
    }
  };

  // Update Venue logic
  const handleUpdateVenue = (venue) => {
    setVenueToEdit(venue);
    setEditVenueFields({
      name: venue.name || '',
      address: venue.address || '',
      description: venue.description || '',
    });
    setEditVenueModalVisible(true);
  };

  const handleSaveVenueUpdate = async () => {
    try {
      // Validate inputs
      if (!editVenueFields.name || !editVenueFields.address) {
        Alert.alert('Validation Error', 'Name and address are required');
        return;
      }
      
      const res = await axios.put(
        `http://10.0.2.2:8000/api/venues/${venueToEdit._id}`,
        { ...editVenueFields, userId }
      );
      
      setVenues(venues.map(v => (v._id === venueToEdit._id ? res.data.venue : v)));
      setEditVenueModalVisible(false);
      setVenueToEdit(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update venue.');
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    try {
      // Check if the date is in ISO format (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid
        
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      }
      
      // If it's in DD/MM/YYYY format
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('/');
        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid
        
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
      }
      
      // If it's already a formatted date string, just return it
      return dateString;
    } catch (error) {
      console.log('Date formatting error:', error);
      return dateString; // Return the original string if there's an error
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading your content...</Text>
      </View>
    );
  }

  const renderGameItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.sportIcon}>🏆</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle}>{item.sport || 'Game'}</Text>
          <Text style={styles.cardSubtitle}>{item.area || 'No location'}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Time:</Text>
          <Text style={styles.infoValue}>{item.time || 'No time specified'}</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.updateButton]} 
          onPress={() => handleUpdateGame(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDeleteGame(item._id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVenueItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.sportIcon}>🏟️</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle}>{item.name || 'Venue'}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>{item.address || 'No address'}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : (
          <Text style={styles.noDescription}>No description available</Text>
        )}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.updateButton]} 
          onPress={() => handleUpdateVenue(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => handleDeleteVenue(item._id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6200EE" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Dashboard</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'games' && styles.activeTab]} 
          onPress={() => setActiveTab('games')}
        >
          <Text style={[styles.tabText, activeTab === 'games' && styles.activeTabText]}>Games</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'venues' && styles.activeTab]} 
          onPress={() => setActiveTab('venues')}
        >
          <Text style={[styles.tabText, activeTab === 'venues' && styles.activeTabText]}>Venues</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {activeTab === 'games' ? (
        games.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No games found</Text>
            <Text style={styles.emptyText}>
              You haven't created any games yet. Tap the button below to add one.
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('CreateGame')}
            >
              <Text style={styles.addButtonText}>Add Game</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={games}
            keyExtractor={item => item._id || Math.random().toString()}
            renderItem={renderGameItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6200EE']} />
            }
          />
        )
      ) : (
        venues.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No venues found</Text>
            <Text style={styles.emptyText}>
              You haven't created any venues yet. Tap the button below to add one.
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('CreateVenue')}
            >
              <Text style={styles.addButtonText}>Add Venue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={venues}
            keyExtractor={item => item._id || Math.random().toString()}
            renderItem={renderVenueItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6200EE']} />
            }
          />
        )
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate(activeTab === 'games' ? 'CreateGame' : 'CreateVenue')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      
      {/* Edit Game Modal */}
      <Modal
        visible={editGameModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditGameModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Game</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Sport"
                  value={editGameFields.sport}
                  onChangeText={text => setEditGameFields({...editGameFields, sport: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Area"
                  value={editGameFields.area}
                  onChangeText={text => setEditGameFields({...editGameFields, area: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Date (YYYY-MM-DD)"
                  value={editGameFields.date}
                  onChangeText={text => setEditGameFields({...editGameFields, date: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Time"
                  value={editGameFields.time}
                  onChangeText={text => setEditGameFields({...editGameFields, time: text})}
                />
                
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setEditGameModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveGameUpdate}
                  >
                    <Text style={styles.modalButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Edit Venue Modal */}
      <Modal
        visible={editVenueModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditVenueModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Venue</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={editVenueFields.name}
                  onChangeText={text => setEditVenueFields({...editVenueFields, name: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={editVenueFields.address}
                  onChangeText={text => setEditVenueFields({...editVenueFields, address: text})}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description"
                  value={editVenueFields.description}
                  onChangeText={text => setEditVenueFields({...editVenueFields, description: text})}
                  multiline={true}
                  numberOfLines={4}
                />
                
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setEditVenueModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveVenueUpdate}
                  >
                    <Text style={styles.modalButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
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
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#6200EE',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sportIcon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 60,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noDescription: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#F0F0F7',
  },
  deleteButton: {
    backgroundColor: '#FFF0F0',
  },
  actionButtonText: {
    fontWeight: '600',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
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
  addButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: width * 0.9,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#6200EE',
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFF',
  },
});

export default MyVenuesGamesScreen;
import { StyleSheet, Text, View, Image, Pressable, FlatList, ScrollView, Dimensions, Button, TextInput, Linking, TouchableOpacity, Modal } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Using Ionicons for icons

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; // 75% of screen width

const ProfileDetailScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const { userId } = useContext(AuthContext);
  const [bio, setBio] = useState(''); // State for editable bio
  const [links, setLinks] = useState(['']); // State for links
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchUpcomingGames();
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchUserProfile();
      }
    }, [userId])
  );

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/profile/${userId}`);
      const { bio, links } = response.data;
      setBio(bio || '');
      setLinks(links || ['']);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/user/${userId}`);
      setUser(response.data);
      setBio(response.data.bio || ''); // Set initial bio from user data
      setLinks(response.data.links || ['']); // Set initial links from user data
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUpcomingGames = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/upcoming?userId=${userId}`);
      setUpcomingGames(response.data);
    } catch (error) {
      console.error('Error fetching upcoming games:', error);
    }
  };

  const handleAddLink = () => {
    setLinks([...links, '']); // Add a new empty link
  };

  const handleLinkChange = (text, index) => {
    const newLinks = [...links];
    newLinks[index] = text; // Update the link at the specified index
    setLinks(newLinks);
  };

  const handleDeleteLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index); // Remove the link at the specified index
    setLinks(newLinks);
  };

  const handleSaveBio = async () => {
    try {
      const response = await axios.post(`http://10.0.2.2:8000/profile/${userId}/bio`, { bio, links });
      if (response.status === 200) {
        alert('Bio saved!');
      } else {
        alert('Failed to save bio. Please try again.');
      }
    } catch (error) {
      console.error('Error saving bio:', error.response ? error.response.data : error);
      alert('Failed to save bio. Please try again.');
    }
    setModalVisible(false);
  };

  const renderProfileCard = () => (
    <View style={styles.profileCard}>
      <Image
        style={styles.profileImage}
        source={{ uri: user?.user?.image || 'https://via.placeholder.com/70' }}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user?.user?.firstName}</Text>
        <Text style={styles.userDetails}>Last Played on 13th March</Text>
        <Text style={styles.bioText}>{bio}</Text>
        {links.length > 0 && (
          <View style={styles.linksContainer}>
            {links.map((link, index) => (
              <Pressable key={index} onPress={() => Linking.openURL(link)}>
                <Text style={styles.linkText}>{link}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderGameCard = ({ item }) => (
    <Pressable
      style={styles.gameCard}
      onPress={() => navigation.navigate('Game', { item })}
    >
      <View style={styles.gameCardContent}>
        <View style={styles.gameHeader}>
          <Text style={styles.sportName}>{item.sport}</Text>
          <View style={styles.hostInfo}>
            <Image
              source={{ uri: item.adminUrl || 'https://via.placeholder.com/30' }}
              style={styles.hostImage}
            />
            <Text style={styles.hostName}>{item.adminName}</Text>
          </View>
        </View>

        <View style={styles.gameDetails}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>⌚</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{item.area}</Text>
          </View>
        </View>

        <View style={styles.participantsSection}>
          <View style={styles.participantAvatars}>
            {item.participants?.slice(0, 3).map((participant, index) => (
              <Image
                key={index}
                source={{ uri: participant.avatar || 'https://via.placeholder.com/30' }}
                style={[
                  styles.participantImage,
                  { marginLeft: index > 0 ? -10 : 0 }
                ]}
              />
            ))}
          </View>
          <Text style={styles.participantCount}>
            {`${item.participants?.length || 0}/${item.maxParticipants || 0}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  // Static data for activities
  const activities = [
    { id: '1', title: 'Yoga Class', description: 'Join us for a relaxing yoga session.', date: 'March 20, 2023', icon: 'fitness-outline' },
    { id: '2', title: 'Football Match', description: 'Participate in a friendly football match.', date: 'March 22, 2023', icon: 'football-outline' },
    { id: '3', title: 'Cooking Workshop', description: 'Learn to cook delicious meals.', date: 'March 25, 2023', icon: 'restaurant-outline' },
  ];

  const renderActivityCard = ({ item }) => (
    <View style={styles.activityCard}>
      <Ionicons name={item.icon} size={24} color="white" style={styles.activityIcon} />
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityDate}>{item.date}</Text>
      </View>
    </View>
  );

  // Static data for recent achievements
  const achievements = [
    { id: '1', title: 'Completed 10 Yoga Classes', date: 'March 15, 2023' },
    { id: '2', title: 'Won Football Match', date: 'March 10, 2023' },
    { id: '3', title: 'Learned 5 New Recipes', date: 'March 5, 2023' },
  ];

  const renderAchievementCard = ({ item }) => (
    <View style={styles.achievementCard}>
      <Text style={styles.achievementTitle}>{item.title}</Text>
      <Text style={styles.achievementDate}>{item.date}</Text>
    </View>
  );

  // Static data for favorite sports
  const favoriteSports = [
    { id: '1', name: 'Basketball', icon: 'basketball-outline' },
    { id: '2', name: 'Tennis', icon: 'tennisball-outline' },
    { id: '3', name: 'Swimming', icon: 'water-outline' },
  ];

  const renderFavoriteSport = ({ item }) => (
    <View style={styles.favoriteSportCard}>
      <Ionicons name={item.icon} size={24} color="#570987" />
      <Text style={styles.favoriteSportName}>{item.name}</Text>
    </View>
  );

  // Static data for upcoming events
  const upcomingEvents = [
    { id: '1', title: 'Community Sports Day', date: 'April 10, 2023' },
    { id: '2', title: 'Charity Run', date: 'April 15, 2023' },
    { id: '3', title: 'Local Tournament', date: 'April 20, 2023' },
  ];

  const renderUpcomingEvent = ({ item }) => (
    <View style={styles.upcomingEventCard}>
      <Text style={styles.upcomingEventTitle}>{item.title}</Text>
      <Text style={styles.upcomingEventDate}>{item.date}</Text>
    </View>
  );

  // Function to open social media links
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <ScrollView style={styles.container}>
      <Ionicons
        onPress={() => navigation.goBack()}
        name="arrow-back"
        size={24}
        color="black"
        style={styles.backButton}
      />
      {renderProfileCard()}
      <View style={styles.bioSection}>
        <Text style={styles.bioTitle}>Bio</Text>
        <Text style={styles.bioText}>{bio}</Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <Ionicons name="create-outline" size={24} color="#570987" />
        </Pressable>
      </View>

      {/* Modal for editing bio */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Bio</Text>
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              placeholder="Edit your bio"
              multiline
            />
            {links.map((link, index) => (
              <View key={index} style={styles.linkContainer}>
                <TextInput
                  style={styles.linkInput}
                  value={link}
                  onChangeText={(text) => handleLinkChange(text, index)}
                  placeholder="Add a link"
                />
                <TouchableOpacity onPress={() => handleDeleteLink(index)}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            <Button title="Add Link" onPress={handleAddLink} color="#570987" />
            <View style={styles.modalButtons}>
              <Button title="Save" onPress={handleSaveBio} color="#570987" />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="gray" />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.gamesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Games</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          data={upcomingGames}
          renderItem={renderGameCard}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gamesList}
        />
      </View>
      <View style={styles.activitiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          data={activities}
          renderItem={renderActivityCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activitiesList}
        />
      </View>
      <View style={styles.achievementsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          data={achievements}
          renderItem={renderAchievementCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.achievementsList}
        />
      </View>
      <View style={styles.favoriteSportsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favorite Sports</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          data={favoriteSports}
          renderItem={renderFavoriteSport}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.favoriteSportsList}
        />
      </View>
      <View style={styles.upcomingEventsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          data={upcomingEvents}
          renderItem={renderUpcomingEvent}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.upcomingEventsList}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    margin: 15,
    alignSelf: 'flex-start',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#570987',
  },
  userDetails: {
    color: 'gray',
    marginTop: 5,
  },
  bioSection: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#570987',
  },
  bioText: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#570987',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  linkInput: {
    flex: 1,
    borderColor: '#570987',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  gamesSection: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#570987',
  },
  seeAll: {
    color: '#570987',
    fontSize: 14,
  },
  gamesList: {
    paddingHorizontal: 10,
  },
  gameCard: {
    width: CARD_WIDTH,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
  },
  gameCardContent: {
    backgroundColor: '#8B3DFF',
    padding: 15,
    height: 150,
    justifyContent: 'space-between',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 5,
    borderRadius: 20,
  },
  hostImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 5,
  },
  hostName: {
    color: 'white',
    fontSize: 12,
    marginRight: 5,
  },
  gameDetails: {
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 5,
  },
  locationIcon: {
    marginRight: 5,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
  },
  participantsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  participantAvatars: {
    flexDirection: 'row',
  },
  participantImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  participantCount: {
    color: 'white',
    fontSize: 14,
  },
  activitiesSection: {
    marginTop: 20,
  },
  activityCard: {
    width: CARD_WIDTH,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: '#FF8B3D',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  activityIcon: {
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  activityDescription: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  activityDate: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  activitiesList: {
    paddingHorizontal: 10,
  },
  achievementsSection: {
    marginTop: 20,
  },
  achievementCard: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  achievementDate: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  achievementsList: {
    paddingHorizontal: 10,
  },
  favoriteSportsSection: {
    marginTop: 20,
  },
  favoriteSportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  favoriteSportName: {
    marginLeft: 10,
    fontSize: 16,
    color: '#570987',
  },
  favoriteSportsList: {
    paddingHorizontal: 10,
  },
  upcomingEventsSection: {
    marginTop: 20,
  },
  upcomingEventCard: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  upcomingEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  upcomingEventDate: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  upcomingEventsList: {
    paddingHorizontal: 10,
  },
  linksContainer: {
    marginTop: 5,
  },
  linkText: {
    color: '#570987',
    textDecorationLine: 'underline',
    marginVertical: 2,
  },
});

export default ProfileDetailScreen;
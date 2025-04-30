import { StyleSheet, Text, View, Image, Pressable, FlatList, ScrollView, Dimensions, Button, TextInput, Linking, TouchableOpacity, Modal, StatusBar, SafeAreaView } from 'react-native';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

// Modern color palette
const COLORS = {
  primary: '#6C63FF', // Modern purple
  secondary: '#FF6584', // Coral pink
  accent1: '#43CBFF', // Bright blue
  accent2: '#9708CC', // Deep purple
  accent3: '#F5A623', // Amber
  success: '#00C48C', // Teal green
  background: '#F7F9FC', // Light gray background
  card: '#FFFFFF', // White card background
  text: '#1A2151', // Dark blue text
  textSecondary: '#6B7280', // Gray text
  border: '#E5E7EB', // Light border
  shadow: 'rgba(0, 0, 0, 0.08)', // Subtle shadow
};

const ProfileDetailScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const { userId } = useContext(AuthContext);
  const [bio, setBio] = useState('');
  const [links, setLinks] = useState(['']);
  const [modalVisible, setModalVisible] = useState(false);

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
      setBio(response.data.bio || '');
      setLinks(response.data.links || ['']);
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
    setLinks([...links, '']);
  };

  const handleLinkChange = (text, index) => {
    const newLinks = [...links];
    newLinks[index] = text;
    setLinks(newLinks);
  };

  const handleDeleteLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
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
      <View style={styles.profileHeader}>
        <Image
          style={styles.profileImage}
          source={{ uri: user?.user?.image || 'https://via.placeholder.com/120' }}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.user?.firstName || 'User Name'}</Text>
          <View style={styles.userStatsRow}>
            <View style={styles.userStat}>
              <Text style={styles.userStatNumber}>24</Text>
              <Text style={styles.userStatLabel}>Games</Text>
            </View>
            <View style={styles.userStatDivider} />
            <View style={styles.userStat}>
              <Text style={styles.userStatNumber}>12</Text>
              <Text style={styles.userStatLabel}>Friends</Text>
            </View>
            <View style={styles.userStatDivider} />
            <View style={styles.userStat}>
              <Text style={styles.userStatNumber}>8</Text>
              <Text style={styles.userStatLabel}>Sports</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>{bio || 'No bio yet. Tap the edit button to add one!'}</Text>
        {links && links.length > 0 && links[0] !== '' && (
          <View style={styles.linksContainer}>
            {links.map((link, index) => (
              link && (
                <TouchableOpacity 
                  key={index} 
                  style={styles.linkButton}
                  onPress={() => Linking.openURL(link)}
                >
                  <Ionicons name="link-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="tail">
                    {link.replace(/^https?:\/\//i, '')}
                  </Text>
                </TouchableOpacity>
              )
            ))}
          </View>
        )}
        <TouchableOpacity 
          style={styles.editBioButton} 
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="create-outline" size={16} color={COLORS.card} />
          <Text style={styles.editBioText}>Edit Profile</Text>
        </TouchableOpacity>
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
          <View style={styles.sportBadge}>
            <Text style={styles.sportName}>{item.sport}</Text>
          </View>
          <View style={styles.hostInfo}>
            <Image
              source={{ uri: item.adminUrl || 'https://via.placeholder.com/30' }}
              style={styles.hostImage}
            />
            <Text style={styles.hostName}>{item.adminName}</Text>
          </View>
        </View>

        <View style={styles.gameDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color={COLORS.card} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color={COLORS.card} style={styles.detailIcon} />
            <Text style={styles.detailText}>{item.area}</Text>
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
            {(item.participants?.length || 0) > 3 && (
              <View style={styles.moreParticipants}>
                <Text style={styles.moreParticipantsText}>+{item.participants.length - 3}</Text>
              </View>
            )}
          </View>
          <View style={styles.participantCountContainer}>
            <Text style={styles.participantCount}>
              {`${item.participants?.length || 0}/${item.maxParticipants || 0}`}
            </Text>
          </View>
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
      <View style={[styles.activityIconContainer, { backgroundColor: COLORS.accent1 }]}>
        <Ionicons name={item.icon} size={24} color={COLORS.card} />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.activityDateContainer}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.activityDate}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  // Static data for recent achievements
  const achievements = [
    { id: '1', title: 'Completed 10 Yoga Classes', date: 'March 15, 2023', icon: 'trophy-outline' },
    { id: '2', title: 'Won Football Match', date: 'March 10, 2023', icon: 'medal-outline' },
    { id: '3', title: 'Learned 5 New Recipes', date: 'March 5, 2023', icon: 'ribbon-outline' },
  ];

  const renderAchievementCard = ({ item }) => (
    <View style={styles.achievementCard}>
      <View style={styles.achievementIconContainer}>
        <Ionicons name={item.icon} size={20} color={COLORS.accent3} />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDate}>{item.date}</Text>
      </View>
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
      <View style={styles.favoriteSportIconContainer}>
        <Ionicons name={item.icon} size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.favoriteSportName}>{item.name}</Text>
    </View>
  );

  // Static data for upcoming events
  const upcomingEvents = [
    { id: '1', title: 'Community Sports Day', date: 'April 10, 2023', location: 'Central Park' },
    { id: '2', title: 'Charity Run', date: 'April 15, 2023', location: 'Downtown' },
    { id: '3', title: 'Local Tournament', date: 'April 20, 2023', location: 'Sports Complex' },
  ];

  const renderUpcomingEvent = ({ item }) => (
    <View style={styles.upcomingEventCard}>
      <View style={styles.upcomingEventHeader}>
        <Text style={styles.upcomingEventTitle}>{item.title}</Text>
        <View style={styles.upcomingEventBadge}>
          <Text style={styles.upcomingEventBadgeText}>New</Text>
        </View>
      </View>
      <View style={styles.upcomingEventDetails}>
        <View style={styles.upcomingEventDetail}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.upcomingEventDetailText}>{item.date}</Text>
        </View>
        <View style={styles.upcomingEventDetail}>
          <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.upcomingEventDetailText}>{item.location}</Text>
        </View>
      </View>
    </View>
  );

  const renderSectionHeader = (title, onSeeAll) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderProfileCard()}
        
        <View style={styles.section}>
          {renderSectionHeader('Upcoming Games', () => {})}
          <FlatList
            data={upcomingGames.length > 0 ? upcomingGames : [
              {_id: '1', sport: 'Basketball', time: '7:00 PM', area: 'Downtown Court', adminName: 'John', participants: [{}, {}, {}], maxParticipants: 10},
              {_id: '2', sport: 'Tennis', time: '5:30 PM', area: 'Central Park', adminName: 'Sarah', participants: [{}, {}], maxParticipants: 4},
            ]}
            renderItem={renderGameCard}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>
        
        <View style={styles.section}>
          {renderSectionHeader('Activities', () => {})}
          <FlatList
            data={activities}
            renderItem={renderActivityCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>
        
        <View style={styles.section}>
          {renderSectionHeader('Favorite Sports', () => {})}
          <FlatList
            data={favoriteSports}
            renderItem={renderFavoriteSport}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>
        
        <View style={styles.section}>
          {renderSectionHeader('Recent Achievements', () => {})}
          <FlatList
            data={achievements}
            renderItem={renderAchievementCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.verticalListContent}
          />
        </View>
        
        <View style={styles.section}>
          {renderSectionHeader('Upcoming Events', () => {})}
          <FlatList
            data={upcomingEvents}
            renderItem={renderUpcomingEvent}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.verticalListContent}
          />
        </View>
      </ScrollView>
      
      {/* Modal for editing bio */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              multiline
              placeholderTextColor={COLORS.textSecondary}
            />
            
            <Text style={styles.inputLabel}>Links</Text>
            {links.map((link, index) => (
              <View key={index} style={styles.linkInputContainer}>
                <TextInput
                  style={styles.linkInput}
                  value={link}
                  onChangeText={(text) => handleLinkChange(text, index)}
                  placeholder="https://example.com"
                  placeholderTextColor={COLORS.textSecondary}
                />
                <TouchableOpacity 
                  style={styles.deleteLinkButton} 
                  onPress={() => handleDeleteLink(index)}
                >
                  <Ionicons name="trash-outline" size={20} color={COLORS.secondary} />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addLinkButton} 
              onPress={handleAddLink}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.addLinkText}>Add Link</Text>
            </TouchableOpacity>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSaveBio}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  backButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  userStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStat: {
    alignItems: 'center',
    flex: 1,
  },
  userStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userStatLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  userStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  bioContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  linkText: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 4,
    maxWidth: 120,
  },
  editBioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editBioText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  horizontalListContent: {
    paddingHorizontal: 12,
  },
  verticalListContent: {
    paddingHorizontal: 16,
  },
  gameCard: {
    width: CARD_WIDTH,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  gameCardContent: {
    padding: 16,
    height: 180,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sportBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  sportName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.card,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  hostImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  hostName: {
    color: COLORS.card,
    fontSize: 12,
    fontWeight: '500',
  },
  gameDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    color: COLORS.card,
    fontSize: 14,
  },
  participantsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  moreParticipants: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  moreParticipantsText: {
    color: COLORS.card,
    fontSize: 10,
    fontWeight: '600',
  },
  participantCountContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  participantCount: {
    color: COLORS.card,
    fontSize: 12,
    fontWeight: '500',
  },
  activityCard: {
    width: CARD_WIDTH,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    padding: 16,
    flexDirection: 'row',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  activityDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 166, 35, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  favoriteSportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  favoriteSportIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  favoriteSportName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  upcomingEventCard: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  upcomingEventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  upcomingEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  upcomingEventBadge: {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingEventBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
  upcomingEventDetails: {
    marginTop: 8,
  },
  upcomingEventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  upcomingEventDetailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  linkInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  deleteLinkButton: {
    padding: 8,
    marginLeft: 8,
  },
  addLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  addLinkText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.card,
    fontWeight: '500',
  },
});

export default ProfileDetailScreen;
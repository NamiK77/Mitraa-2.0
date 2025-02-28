import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(AuthContext);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [user, setUser] = useState(null);
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      const [userResponse, upcomingResponse, allGamesResponse] = await Promise.all([
        axios.get(`http://10.0.2.2:8000/user/${userId}`),
        axios.get(`http://10.0.2.2:8000/upcoming?userId=${userId}`),
        axios.get('http://10.0.2.2:8000/games')
      ]);

      setUser(userResponse.data);
      setUpcomingGames(upcomingResponse.data);
      setAllGames(allGamesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const renderWelcomeSection = () => (
    <View style={styles.welcomeSection}>
      <LinearGradient
        colors={['#570987', '#7D0DC3']}
        style={styles.welcomeGradient}
      >
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeHeader}>
            <View>
              <Text style={styles.welcomeTitle}>Welcome back,</Text>
              <Text style={styles.userName}>
                {user?.user?.firstName || 'Player'}!
              </Text>
            </View>
            <Pressable 
              onPress={() => navigation.navigate('ProfileDetail')}
              style={styles.profileImageContainer}
            >
              <Image
                style={styles.profileImage}
                source={{
                  uri: user?.user?.image || 'https://via.placeholder.com/60',
                }}
              />
            </Pressable>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{allGames?.length || 0}</Text>
              <Text style={styles.statLabel}>Active Games</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{upcomingGames?.length || 0}</Text>
              <Text style={styles.statLabel}>Your Games</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      {[
        {
          icon: 'calendar',
          label: 'Calendar',
          onPress: () => navigation.navigate('PLAY', { initialOption: 'Calendar' }),
          color: '#570987',
        },
        {
          icon: 'plus',
          label: 'Create Game',
          onPress: () => navigation.navigate('Create'),
          color: '#A020F0',
        },
        {
          icon: 'team',
          label: 'Find Players',
          onPress: () => navigation.navigate('PLAY'),
          color: '#B95CF4',
        },
      ].map((action, index) => (
        <Pressable
          key={index}
          style={styles.quickActionButton}
          onPress={action.onPress}
        >
          <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
            <AntDesign name={action.icon} size={24} color="white" />
          </View>
          <Text style={styles.quickActionLabel}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderUpcomingGames = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Games</Text>
        <Pressable onPress={() => navigation.navigate('PLAY')}>
          <Text style={styles.seeAllButton}>See All</Text>
        </Pressable>
      </View>
      {upcomingGames?.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {upcomingGames.map((game) => (
            <Pressable
              key={game._id}
              style={styles.gameCard}
              onPress={() => navigation.navigate('Game', { item: game })}
            >
              <LinearGradient
                colors={['rgba(87, 9, 135, 0.95)', 'rgba(125, 13, 195, 0.85)']}
                style={styles.gameCardGradient}
              >
                <View style={styles.gameCardHeader}>
                  <Text style={styles.sportName}>{game.sport}</Text>
                  <View style={styles.hostContainer}>
                    <Image
                      source={{ 
                        uri: game.adminUrl || 'https://via.placeholder.com/40'
                      }}
                      style={styles.hostImage}
                    />
                    <Text style={styles.hostName}>
                      {game.adminName || 'Host'}
                    </Text>
                  </View>
                </View>

                <View style={styles.gameInfoContainer}>
                  <View style={styles.gameDetailRow}>
                    <Ionicons name="time-outline" size={16} color="white" />
                    <Text style={styles.gameDetailText}>{game.time}</Text>
                  </View>
                  <View style={styles.gameDetailRow}>
                    <Ionicons name="location-outline" size={16} color="white" />
                    <Text style={styles.gameDetailText}>{game.area}</Text>
                  </View>
                  <View style={styles.playersContainer}>
                    <View style={styles.playerAvatars}>
                      {game.players?.slice(0, 3).map((player, index) => (
                        <Image
                          key={index}
                          source={{ 
                            uri: player.imageUrl || 'https://via.placeholder.com/30'
                          }}
                          style={[
                            styles.playerAvatar,
                            { marginLeft: index > 0 ? -10 : 0 },
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={styles.playerCount}>
                      {game.players?.length || 0}/{game.totalPlayers || 0}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noGamesContainer}>
          <Ionicons name="calendar-outline" size={40} color="#999" />
          <Text style={styles.noGamesText}>No upcoming games</Text>
          <Pressable
            style={styles.createGameButton}
            onPress={() => navigation.navigate('Create')}
          >
            <Text style={styles.createGameText}>Create a Game</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7D0DC3" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {renderWelcomeSection()}
      {renderQuickActions()}
      {renderUpcomingGames()}
      
      <View style={styles.mainActionsContainer}>
        <Pressable
          style={styles.mainActionCard}
          onPress={() => navigation.navigate('PLAY')}
        >
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg',
            }}
            style={styles.mainActionImage}
          />
          <LinearGradient
            colors={['rgba(87, 9, 135, 0.9)', 'transparent']}
            style={styles.mainActionGradient}
          >
            <Text style={styles.mainActionTitle}>Find Games</Text>
            <Text style={styles.mainActionSubtitle}>
              Join players and activities nearby
            </Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          style={styles.mainActionCard}
          onPress={() => navigation.navigate('BOOK')}
        >
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg',
            }}
            style={styles.mainActionImage}
          />
          <LinearGradient
            colors={['rgba(87, 9, 135, 0.9)', 'transparent']}
            style={styles.mainActionGradient}
          >
            <Text style={styles.mainActionTitle}>Book Venue</Text>
            <Text style={styles.mainActionSubtitle}>
              Reserve courts and facilities
            </Text>
          </LinearGradient>
        </Pressable>

        {/* Featured Activities */}
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>Featured Activities</Text>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <AntDesign name="arrowright" size={16} color="#7D0DC3" />
            </Pressable>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {[
              {
                title: 'Basketball League',
                time: '7:00 PM',
                date: 'Today',
                location: 'Central Court',
                image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg',
                players: '8/10',
                level: 'Intermediate'
              },
              {
                title: 'Tennis Match',
                time: '5:30 PM',
                date: 'Tomorrow',
                location: 'Grand Slam Courts',
                image: 'https://images.pexels.com/photos/8224146/pexels-photo-8224146.jpeg',
                players: '2/4',
                level: 'Advanced'
              }
            ].map((activity, index) => (
              <Pressable key={index} style={styles.featuredCard}>
                <Image source={{ uri: activity.image }} style={styles.featuredImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.featuredOverlay}
                >
                  <View style={styles.featuredContent}>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>{activity.level}</Text>
                    </View>
                    <View>
                      <Text style={styles.featuredTitle}>{activity.title}</Text>
                      <View style={styles.featuredDetails}>
                        <View style={styles.detailItem}>
                          <Ionicons name="time-outline" size={16} color="#FFD700" />
                          <Text style={styles.detailText}>{activity.time}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Ionicons name="location-outline" size={16} color="#FFD700" />
                          <Text style={styles.detailText}>{activity.location}</Text>
                        </View>
                      </View>
                      <View style={styles.playerInfo}>
                        <View style={styles.playerCount}>
                          <Ionicons name="people" size={16} color="#FFD700" />
                          <Text style={styles.playerText}>{activity.players}</Text>
                        </View>
                        <Pressable style={styles.joinButton}>
                          <Text style={styles.joinButtonText}>Join</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Quick Access */}
        <View style={styles.quickAccessSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionHeaderTitle}>Quick Access</Text>
              <Text style={styles.sectionSubtitle}>Everything you need</Text>
            </View>
          </View>

          <View style={styles.quickList}>
            {[
              { 
                title: 'My Teams', 
                subtitle: 'View your teams & matches',
                icon: 'team', 
                color: '#FF6B6B',
                gradient: ['#FF6B6B', '#FF8E8E']
              },
              { 
                title: 'Tournaments', 
                subtitle: 'Join upcoming competitions',
                icon: 'star', 
                color: '#4ECDC4',
                gradient: ['#4ECDC4', '#6EE7E0']
              },
              { 
                title: 'Leaderboard', 
                subtitle: 'Check rankings & stats',
                icon: 'barchart', 
                color: '#45B7D1',
                gradient: ['#45B7D1', '#67D5EF']
              },
              { 
                title: 'Training', 
                subtitle: 'Improve your skills',
                icon: 'calendar', 
                color: '#96C93D',
                gradient: ['#96C93D', '#B4E555']
              }
            ].map((item, index) => (
              <Pressable 
                key={index} 
                style={styles.quickItem}
              >
                <LinearGradient
                  colors={item.gradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.quickItemGradient}
                >
                  <View style={styles.quickItemContent}>
                    <View style={styles.quickItemLeft}>
                      <View style={styles.quickItemIcon}>
                        <AntDesign name={item.icon} size={24} color="white" />
                      </View>
                      <View style={styles.quickItemTextContainer}>
                        <Text style={styles.quickItemTitle}>{item.title}</Text>
                        <Text style={styles.quickItemSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>
                    <AntDesign name="right" size={20} color="white" />
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>Upcoming Events</Text>
            <Pressable style={styles.calendarButton}>
              <Ionicons name="calendar-outline" size={20} color="#7D0DC3" />
            </Pressable>
          </View>
          
          {[1, 2].map((_, index) => (
            <Pressable key={index} style={styles.eventCard}>
              <LinearGradient
                colors={['#570987', '#7D0DC3']}
                style={styles.eventGradient}
              >
                <View style={styles.eventDate}>
                  <Text style={styles.eventDay}>25</Text>
                  <Text style={styles.eventMonth}>JUN</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>Summer Sports Festival</Text>
                  <View style={styles.eventDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={16} color="white" />
                      <Text style={styles.eventDetailText}>2:00 PM</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="location-outline" size={16} color="white" />
                      <Text style={styles.eventDetailText}>Central Park</Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    height: 200,
  },
  welcomeGradient: {
    height: '100%',
    padding: 20,
  },
  welcomeContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileImageContainer: {
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#D397F8',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(211, 151, 248, 0.15)',
    borderRadius: 12,
    padding: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: -30,
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    elevation: 5,
    shadowColor: '#570987',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#570987',
    fontWeight: '500',
    marginTop: 8,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#570987',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#7D0DC3',
    fontWeight: '500',
  },
  gameCard: {
    width: 280,
    height: 180,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  gameCardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sportName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 6,
    borderRadius: 20,
  },
  hostImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#D397F8',
  },
  hostName: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  gameInfoContainer: {
    gap: 8,
  },
  gameDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gameDetailText: {
    color: 'white',
    fontSize: 14,
  },
  playersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  playerAvatars: {
    flexDirection: 'row',
  },
  playerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  playerCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  noGamesContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noGamesText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  createGameButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#7D0DC3',
    borderRadius: 20,
  },
  createGameText: {
    color: 'white',
    fontWeight: '500',
  },
  mainActionsContainer: {
    padding: 20,
    gap: 15,
  },
  mainActionCard: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  mainActionImage: {
    width: '100%',
    height: '100%',
  },
  mainActionGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  mainActionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  mainActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  featuredSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C0650',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: '#7D0DC3',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredCard: {
    width: 300,
    height: 200,
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  featuredContent: {
    gap: 8,
  },
  levelBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelText: {
    color: '#2C0650',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuredDetails: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    color: 'white',
    fontSize: 13,
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  playerCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playerText: {
    color: 'white',
    fontSize: 13,
  },
  joinButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  joinButtonText: {
    color: '#2C0650',
    fontWeight: '600',
    fontSize: 13,
  },
  quickAccessSection: {
    padding: 20,
  },
  quickList: {
    marginTop: 15,
    gap: 12,
  },
  quickItem: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  quickItemGradient: {
    padding: 16,
  },
  quickItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickItemTextContainer: {
    gap: 4,
  },
  quickItemTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickItemSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
  },
  eventsSection: {
    padding: 20,
  },
  calendarButton: {
    backgroundColor: 'rgba(125, 13, 195, 0.1)',
    padding: 8,
    borderRadius: 12,
  },
  eventCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 15,
  },
  eventDate: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  eventDay: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventMonth: {
    color: 'white',
    fontSize: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDetailText: {
    color: 'white',
    fontSize: 13,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;

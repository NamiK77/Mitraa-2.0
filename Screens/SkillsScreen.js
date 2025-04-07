import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Image,
  Platform,
  Easing
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const sports = ['Football', 'Basketball', 'Tennis', 'Badminton', 'Swimming', 'Volleyball'];
const skillLevels = ['Beginner', 'Intermediate', 'Pro'];

// Custom components
const ProgressBar = ({ progress, color = '#4A6FFF' }) => {
  const width = `${progress * 100}%`;
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width, backgroundColor: color }]} />
    </View>
  );
};

const SkillBadge = ({ title, level, emoji }) => {
  return (
    <View style={styles.skillBadge}>
      <View style={styles.skillBadgeIcon}>
        <Text style={styles.skillBadgeEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.skillBadgeTitle}>{title}</Text>
      <Text style={styles.skillBadgeLevel}>{level}</Text>
    </View>
  );
};

const RecommendedSkill = ({ title, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.recommendedSkill} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.recommendedSkillContent}>
        <Text style={styles.recommendedSkillTitle}>{title}</Text>
        <Text style={styles.recommendedSkillDescription}>{description}</Text>
      </View>
      <Text style={styles.recommendedSkillArrow}>›</Text>
    </TouchableOpacity>
  );
};

const SkillsScreen = ({ navigation }) => {
  const [userSkills, setUserSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('skills');
  const { userId } = useContext(AuthContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef({}).current;
  
  // Mock user data
  const userData = {
    name: "Set Your Skills",
    level: "Advanced",
    points: 1250,
    profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgn6ABvcqTfFPjcIbjc9hdx1H4PtQsAuVyTQ&s",
    achievements: [
      { id: 1, title: "Quick Learner", description: "Reached intermediate level in 3 sports", emoji: "🚀" },
      { id: 2, title: "All-Rounder", description: "Added skills in 5 different sports", emoji: "🏆" }
    ],
    recommendations: [
      { id: 1, title: "Golf", description: "Based on your Tennis skills", emoji: "⛳" },
      { id: 2, title: "Rugby", description: "Popular among Football players", emoji: "🏉" }
    ],
    history: [
      { id: 1, date: "2023-10-15", sport: "Basketball", from: "Beginner", to: "Intermediate", emoji: "🏀" },
      { id: 2, date: "2023-09-22", sport: "Football", from: "Intermediate", to: "Pro", emoji: "⚽" }
    ]
  };

  // Initialize animation references for each sport
  useEffect(() => {
    sports.forEach(sport => {
      scaleAnim[sport] = {};
      skillLevels.forEach(level => {
        scaleAnim[sport][level] = new Animated.Value(1);
      });
    });
  }, []);

  useEffect(() => {
    fetchUserSkills();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const fetchUserSkills = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8000/api/users/${userId}/skills`);
      setUserSkills(response.data.skills || {});
      setLoading(false);
    } catch (error) {
      console.error('Error fetching skills:', error.message);
      Alert.alert('Error', 'Failed to fetch skills. Please check your network connection.');
      setLoading(false);
    }
  };

  const updateSkill = (sport, level) => {
    // Animate the button press
    Animated.sequence([
      Animated.timing(scaleAnim[sport][level], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim[sport][level], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start();

    setUserSkills(prev => ({
      ...prev,
      [sport]: level
    }));
  };

  const saveSkills = async () => {
    setSaving(true);
    try {
      await axios.post(`http://10.0.2.2:8000/api/users/${userId}/skills`, { skills: userSkills });
      setSaving(false);
      Alert.alert('Success', 'Skills updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving skills:', error.message);
      Alert.alert('Error', 'Failed to save skills. Please check your network connection.');
      setSaving(false);
    }
  };

  const calculateSkillProgress = () => {
    const totalSkills = sports.length;
    const completedSkills = Object.keys(userSkills).length;
    return completedSkills / totalSkills;
  };

  const getSkillLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return '#4ECDC4';
      case 'Intermediate': return '#FF9F1C';
      case 'Pro': return '#FF5757';
      default: return '#4A6FFF';
    }
  };

  const getSportEmoji = (sport) => {
    switch(sport) {
      case 'Football': return '⚽';
      case 'Basketball': return '🏀';
      case 'Tennis': return '🎾';
      case 'Badminton': return '🏸';
      case 'Swimming': return '🏊‍♂️';
      case 'Volleyball': return '🏐';
      default: return '🏅';
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#4A6FFF', '#389BFF']}
        style={styles.loadingContainer}
      >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Loading your skills profile...</Text>
      </LinearGradient>
    );
  }

  const renderSkillsTab = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Sports Skills</Text>
        <Text style={styles.sectionSubtitle}>Select your level for each sport</Text>
      </View>
      
      {sports.map((sport, index) => (
        <Animated.View 
          key={sport} 
          style={[
            styles.sportContainer,
            { 
              transform: [{ 
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50 * (index + 1), 0]
                }) 
              }],
              opacity: fadeAnim
            }
          ]}
        >
          <View style={styles.sportHeaderContainer}>
            <View style={styles.sportTitleContainer}>
              <Text style={styles.sportEmoji}>{getSportEmoji(sport)}</Text>
              <Text style={styles.sportTitle}>{sport}</Text>
            </View>
            {userSkills[sport] && (
              <View style={[styles.selectedBadge, { backgroundColor: `${getSkillLevelColor(userSkills[sport])}20` }]}>
                <Text style={[styles.selectedBadgeText, { color: getSkillLevelColor(userSkills[sport]) }]}>
                  {userSkills[sport]}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.levelsContainer}>
            {skillLevels.map(level => (
              <Animated.View
                key={level}
                style={{
                  transform: [{ scale: scaleAnim[sport]?.[level] || 1 }],
                  flex: 1,
                  marginHorizontal: 4,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.levelButton,
                    userSkills[sport] === level && [
                      styles.selectedLevel,
                      { backgroundColor: getSkillLevelColor(level) }
                    ]
                  ]}
                  onPress={() => updateSkill(sport, level)}
                  activeOpacity={0.7}
                >
                  <Text 
                    style={[
                      styles.levelText,
                      userSkills[sport] === level && styles.selectedLevelText
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
          
          {userSkills[sport] && (
            <View style={styles.skillProgressContainer}>
              <ProgressBar 
                progress={
                  userSkills[sport] === 'Beginner' ? 0.33 : 
                  userSkills[sport] === 'Intermediate' ? 0.66 : 1
                } 
                color={getSkillLevelColor(userSkills[sport])}
              />
            </View>
          )}
        </Animated.View>
      ))}
    </>
  );

  const renderAchievementsTab = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Achievements</Text>
        <Text style={styles.sectionSubtitle}>Milestones you've reached</Text>
      </View>
      
      <View style={styles.achievementsContainer}>
        {userData.achievements.map(achievement => (
          <View key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementIconContainer}>
              <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementDescription}>{achievement.description}</Text>
            </View>
          </View>
        ))}
        
        <View style={styles.recommendedSkillsContainer}>
          <Text style={styles.recommendedSkillsTitle}>Recommended Skills</Text>
          {userData.recommendations.map(recommendation => (
            <RecommendedSkill 
              key={recommendation.id}
              title={recommendation.title}
              description={recommendation.description}
              onPress={() => Alert.alert('Add Skill', `Would you like to add ${recommendation.title} to your skills?`)}
            />
          ))}
        </View>
      </View>
    </>
  );

  const renderHistoryTab = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Skill History</Text>
        <Text style={styles.sectionSubtitle}>Your progress over time</Text>
      </View>
      
      <View style={styles.historyContainer}>
        {userData.history.map(item => (
          <View key={item.id} style={styles.historyItem}>
            <View style={styles.historyDateContainer}>
              <Text style={styles.historyDateIcon}>🕒</Text>
              <Text style={styles.historyDate}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.historyContent}>
              <View style={styles.historySportContainer}>
                <Text style={styles.historySportEmoji}>{item.emoji}</Text>
                <Text style={styles.historySport}>{item.sport}</Text>
              </View>
              <View style={styles.historyProgressContainer}>
                <Text style={[styles.historyLevel, { color: getSkillLevelColor(item.from) }]}>{item.from}</Text>
                <Text style={styles.historyArrow}>➔</Text>
                <Text style={[styles.historyLevel, { color: getSkillLevelColor(item.to) }]}>{item.to}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header Section */}
      <LinearGradient
        colors={['#4A6FFF', '#389BFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          {/* User Profile Section */}
          <View style={styles.userProfileContainer}>
            <View style={styles.userProfileImageContainer}>
              {userData.profileImage ? (
                <Image 
                  source={{ uri: userData.profileImage }} 
                  style={styles.userProfileImage} 
                />
              ) : (
                <View style={styles.userProfileImagePlaceholder}>
                  <Text style={styles.userProfileImagePlaceholderText}>👤</Text>
                </View>
              )}
            </View>
            
            <View style={styles.userProfileInfo}>
              <Text style={styles.userProfileName}>{userData.name}</Text>
              <View style={styles.userProfileLevelContainer}>
                <Text style={styles.userProfileLevel}>{userData.level}</Text>
                <View style={styles.userProfilePoints}>
                  <Text style={styles.userProfilePointsIcon}>⭐</Text>
                  <Text style={styles.userProfilePointsText}>{userData.points} pts</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Overall Progress */}
          <View style={styles.overallProgressContainer}>
            <View style={styles.overallProgressHeader}>
              <Text style={styles.overallProgressTitle}>Overall Progress</Text>
              <Text style={styles.overallProgressPercentage}>
                {Math.round(calculateSkillProgress() * 100)}%
              </Text>
            </View>
            <ProgressBar progress={calculateSkillProgress()} color="white" />
          </View>
          
          {/* Decorative elements */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </View>
      </LinearGradient>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'skills' && styles.activeTabButton]}
          onPress={() => setActiveTab('skills')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'skills' && styles.activeTabButtonText]}>
            Skills
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'achievements' && styles.activeTabButton]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'achievements' && styles.activeTabButtonText]}>
            Achievements
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'history' && styles.activeTabButtonText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {activeTab === 'skills' && renderSkillsTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
          {activeTab === 'history' && renderHistoryTab()}
          
          {activeTab === 'skills' && (
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={saveSkills}
              disabled={saving}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4A6FFF', '#389BFF']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Skills</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4A6FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#4A6FFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    zIndex: 10,
  },
  headerContent: {
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: '300',
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userProfileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
  },
  userProfileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  userProfileImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  userProfileImagePlaceholderText: {
    fontSize: 24,
  },
  userProfileInfo: {
    flex: 1,
  },
  userProfileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userProfileLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileLevel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
  },
  userProfilePoints: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfilePointsIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  userProfilePointsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  overallProgressContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  overallProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overallProgressTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  overallProgressPercentage: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  decorCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: -30,
  },
  decorCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -20,
    left: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#4A6FFF',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabButtonText: {
    color: '#4A6FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  sportContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sportHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sportTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  sportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  selectedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedLevel: {
    borderColor: 'transparent',
  },
  levelText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedLevelText: {
    color: 'white',
  },
  skillProgressContainer: {
    marginTop: 15,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#4A6FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Achievement styles
  achievementsContainer: {
    marginBottom: 20,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(74, 111, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  recommendedSkillsContainer: {
    marginTop: 25,
  },
  recommendedSkillsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recommendedSkill: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  recommendedSkillContent: {
    flex: 1,
  },
  recommendedSkillTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  recommendedSkillDescription: {
    fontSize: 14,
    color: '#666',
  },
  recommendedSkillArrow: {
    fontSize: 24,
    color: '#4A6FFF',
    fontWeight: '300',
  },
  // History styles
  historyContainer: {
    marginBottom: 20,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyDateIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  historyContent: {
    paddingLeft: 5,
  },
  historySportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historySportEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  historySport: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyLevel: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyArrow: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#666',
  },
  // Skill badge styles
  skillBadge: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: (width - 60) / 2,
    marginBottom: 15,
  },
  skillBadgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(74, 111, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  skillBadgeEmoji: {
    fontSize: 24,
  },
  skillBadgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  skillBadgeLevel: {
    fontSize: 14,
    color: '#666',
  },
});

export default SkillsScreen;
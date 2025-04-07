import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, StatusBar, Animated, Platform } from 'react-native';
import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import MapView, { Marker } from 'react-native-maps';

// Modern purple theme colors
const COLORS = {
  primary: '#6200ee',       // Deep purple
  primaryDark: '#3700b3',   // Darker purple
  primaryLight: '#bb86fc',  // Light purple
  surface: '#ffffff',
  background: '#f8f5ff',    // Very light purple tint
  onSurface: '#1f1f1f',
  onBackground: '#2e2e2e',
  border: '#e0e0e0',
  error: '#b00020',
  success: '#4caf50',
  text: '#424242',
  textSecondary: '#757575',
  disabled: '#bdbdbd',
}

const AddVenueScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'sports', 'review'
  const [venueData, setVenueData] = useState({
    name: '',
    rating: 4,
    deferLink: '',
    fullLink: '',
    avgRating: 4,
    ratingCount: 0,
    lat: 0,
    lng: 0,
    icon: 'https://maps.google.com/mapfiles/kml/paddle/4-lv.png',
    filter_by: [],
    sportsAvailable: [],
    image: 'https://via.placeholder.com/400',
    location: '',
    address: '',
    bookings: []
  });

  const [currentSport, setCurrentSport] = useState({
    id: '',
    name: '',
    icon: '',
    price: 0,
    courts: []
  });

  const [currentCourt, setCurrentCourt] = useState({
    id: '',
    name: '',
    number: 0
  });

  const [filterInput, setFilterInput] = useState('');
  const [errors, setErrors] = useState({});

  const validateBasicInfo = () => {
    let isValid = true;
    let newErrors = {};
    
    if (!venueData.name.trim()) {
      newErrors.name = 'Venue name is required';
      isValid = false;
    }
    
    if (!venueData.location.trim()) {
      newErrors.location = 'Location is required';
      isValid = false;
    }
    
    if (!venueData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleNextTab = () => {
    if (activeTab === 'basic') {
      if (validateBasicInfo()) {
        setActiveTab('sports');
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    } else if (activeTab === 'sports') {
      if (venueData.sportsAvailable.length === 0) {
        Alert.alert('Error', 'Please add at least one sport');
        return;
      }
      setActiveTab('review');
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handlePrevTab = () => {
    if (activeTab === 'sports') {
      setActiveTab('basic');
    } else if (activeTab === 'review') {
      setActiveTab('sports');
    }
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleSubmit = async () => {
    try {
      // First validate required fields
      if (!venueData.name || !venueData.location || !venueData.address || 
          venueData.sportsAvailable.length === 0) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      // Debug log the data being sent
      console.log('Submitting venue data:', venueData);

      // Correct endpoint URL
      const endpoint = 'http://10.0.2.2:8000/api/venues';

      try {
        const response = await axios.post(endpoint, venueData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.status === 200 || response.status === 201) {
          Alert.alert('Success', 'Venue added successfully!');
          navigation.goBack();
          return;
        }
      } catch (err) {
        console.log(`Failed on endpoint ${endpoint}:`, err.message);
        Alert.alert('Error', 'Failed to add venue');
      }
    } catch (error) {
      console.error('Full error:', error);
      let errorMessage = 'Failed to add venue. Details:\n';

      if (error.response) {
        errorMessage += `Status: ${error.response.status}\n`;
        errorMessage += `Data: ${JSON.stringify(error.response.data)}\n`;
        errorMessage += `Headers: ${JSON.stringify(error.response.headers)}`;
      } else if (error.request) {
        errorMessage += 'No response received from server. Check:\n';
        errorMessage += '1. Backend server is running\n';
        errorMessage += '2. Correct IP/port\n';
        errorMessage += '3. No network issues';
      } else {
        errorMessage += `Request setup error: ${error.message}`;
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  const addSport = () => {
    if (currentSport.name && currentSport.id) {
      setVenueData({
        ...venueData,
        sportsAvailable: [...venueData.sportsAvailable, {...currentSport}]
      });
      setCurrentSport({
        id: '',
        name: '',
        icon: '',
        price: 0,
        courts: []
      });
      Alert.alert('Success', 'Sport added successfully');
    } else {
      Alert.alert('Error', 'Sport ID and name are required');
    }
  };

  const addCourt = () => {
    if (currentCourt.name && currentCourt.id) {
      setCurrentSport({
        ...currentSport,
        courts: [...currentSport.courts, {...currentCourt}]
      });
      setCurrentCourt({
        id: '',
        name: '',
        number: 0
      });
      Alert.alert('Success', 'Court added to sport');
    } else {
      Alert.alert('Error', 'Court ID and name are required');
    }
  };

  const addFilter = () => {
    if (filterInput) {
      setVenueData({
        ...venueData,
        filter_by: [...venueData.filter_by, filterInput]
      });
      setFilterInput('');
    }
  };

  const removeFilter = (index) => {
    const updatedFilters = [...venueData.filter_by];
    updatedFilters.splice(index, 1);
    setVenueData({...venueData, filter_by: updatedFilters});
  };

  const removeSport = (index) => {
    const updatedSports = [...venueData.sportsAvailable];
    updatedSports.splice(index, 1);
    setVenueData({...venueData, sportsAvailable: updatedSports});
  };

  const renderBasicInfoTab = () => (
    <Animated.View style={{opacity: fadeAnim}}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="place" size={22} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Venue Details</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Venue Name<Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="business" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter venue name"
              value={venueData.name}
              onChangeText={(text) => {
                setVenueData({...venueData, name: text});
                if (errors.name) {
                  setErrors({...errors, name: null});
                }
              }}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location<Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="location-on" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              value={venueData.location}
              onChangeText={(text) => {
                setVenueData({...venueData, location: text});
                if (errors.location) {
                  setErrors({...errors, location: null});
                }
              }}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address<Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="home" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter full address"
              value={venueData.address}
              onChangeText={(text) => {
                setVenueData({...venueData, address: text});
                if (errors.address) {
                  setErrors({...errors, address: null});
                }
              }}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="image" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              value={venueData.image}
              onChangeText={(text) => setVenueData({...venueData, image: text})}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="filter-list" size={22} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Venue Filters</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Add Filters</Text>
          <View style={styles.row}>
            <View style={[styles.inputContainer, {flex: 1, marginBottom: 0}]}>
              <MaterialIcons name="label" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Add filter (e.g. Pool, Snooker)"
                value={filterInput}
                onChangeText={setFilterInput}
                placeholderTextColor={COLORS.disabled}
              />
            </View>
            <TouchableOpacity style={styles.addSmallButton} onPress={addFilter}>
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterContainer}>
            {venueData.filter_by.map((filter, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.filterTag}
                onPress={() => removeFilter(index)}
              >
                <Text style={styles.filterText}>{filter}</Text>
                <MaterialIcons name="close" size={16} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))}
            {venueData.filter_by.length === 0 && (
              <Text style={styles.emptyText}>No filters added yet</Text>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderSportsTab = () => (
    <Animated.View style={{opacity: fadeAnim}}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="sports-tennis" size={22} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Sport Details</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sport ID<Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="tag" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter sport ID"
              value={currentSport.id}
              onChangeText={(text) => setCurrentSport({...currentSport, id: text})}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sport Name<Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="sports-basketball" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter sport name"
              value={currentSport.name}
              onChangeText={(text) => setCurrentSport({...currentSport, name: text})}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sport Icon</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="image" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter icon name"
              value={currentSport.icon}
              onChangeText={(text) => setCurrentSport({...currentSport, icon: text})}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price<Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="attach-money" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              keyboardType="numeric"
              value={currentSport.price.toString()}
              onChangeText={(text) => setCurrentSport({...currentSport, price: Number(text) || 0})}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="grid-on" size={22} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Court Details</Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Court ID<Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="tag" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter court ID"
              value={currentCourt.id}
              onChangeText={(text) => setCurrentCourt({...currentCourt, id: text})}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Court Name<Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="meeting-room" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter court name"
              value={currentCourt.name}
              onChangeText={(text) => setCurrentCourt({...currentCourt, name: text})}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Court Number<Text style={styles.required}>*</Text></Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="format-list-numbered" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter court number"
              keyboardType="numeric"
              value={currentCourt.number.toString()}
              onChangeText={(text) => setCurrentCourt({...currentCourt, number: Number(text) || 0})}
              placeholderTextColor={COLORS.disabled}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={addCourt}>
          <MaterialIcons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add Court</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={addSport}>
        <MaterialIcons name="sports-tennis" size={20} color="#fff" />
        <Text style={styles.buttonText}>Add Sport</Text>
      </TouchableOpacity>

      {/* Display added sports */}
      {venueData.sportsAvailable.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="list" size={22} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Added Sports</Text>
          </View>
          
          {venueData.sportsAvailable.map((sport, index) => (
            <Animated.View 
              key={index} 
              style={styles.sportCard}
            >
              <View style={styles.sportCardHeader}>
                <View style={styles.sportIconContainer}>
                  <MaterialIcons name="sports-basketball" size={22} color="#fff" />
                </View>
                <Text style={styles.sportTitle}>{sport.name}</Text>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => removeSport(index)}
                >
                  <MaterialIcons name="delete-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.sportDetails}>
                <View style={styles.sportDetail}>
                  <MaterialIcons name="tag" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.sportDetailText}>ID: {sport.id}</Text>
                </View>
                <View style={styles.sportDetail}>
                  <MaterialIcons name="attach-money" size={16} color={COLORS.primary} />
                  <Text style={styles.sportDetailText}>Price: ₹{sport.price}</Text>
                </View>
              </View>
              
              {sport.courts.length > 0 && (
                <View style={styles.courtsContainer}>
                  <Text style={styles.courtsTitle}>Courts:</Text>
                  {sport.courts.map((court, courtIndex) => (
                    <View key={courtIndex} style={styles.courtItem}>
                      <MaterialIcons name="sports-cricket" size={16} color={COLORS.primary} />
                      <Text style={styles.courtText}>
                        {court.name} (#{court.number})
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Animated.View>
          ))}
        </View>
      )}
    </Animated.View>
  );

  const renderReviewTab = () => (
    <Animated.View style={{opacity: fadeAnim}}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="check-circle" size={22} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Review Venue Details</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Venue Name:</Text>
          <Text style={styles.reviewValue}>{venueData.name}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Location:</Text>
          <Text style={styles.reviewValue}>{venueData.location}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Address:</Text>
          <Text style={styles.reviewValue}>{venueData.address}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Image URL:</Text>
          <Text style={styles.reviewValue}>{venueData.image}</Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Filters:</Text>
          <View style={styles.reviewFilterContainer}>
            {venueData.filter_by.map((filter, index) => (
              <View key={index} style={styles.reviewFilterTag}>
                <Text style={styles.reviewFilterText}>{filter}</Text>
              </View>
            ))}
            {venueData.filter_by.length === 0 && (
              <Text style={styles.emptyText}>No filters added</Text>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="sports-tennis" size={22} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Sports Summary</Text>
        </View>
        
        <Text style={styles.summaryText}>
          Total Sports: {venueData.sportsAvailable.length}
        </Text>
        
        {venueData.sportsAvailable.map((sport, index) => (
          <View key={index} style={styles.reviewSportItem}>
            <Text style={styles.reviewSportTitle}>{sport.name}</Text>
            <Text style={styles.reviewSportDetail}>Price: ₹{sport.price}</Text>
            <Text style={styles.reviewSportDetail}>
              Courts: {sport.courts.length} {sport.courts.length > 0 ? 
                `(${sport.courts.map(c => c.name).join(', ')})` : ''}
            </Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
      >
        <MaterialIcons name="check-circle" size={24} color="#fff" />
        <Text style={styles.submitButtonText}>Submit Venue</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Venue</Text>
        <View style={{width: 40}} />
      </View>
      
      {/* Progress Tabs */}
      <View style={styles.progressContainer}>
        <TouchableOpacity 
          style={[styles.progressTab, activeTab === 'basic' && styles.activeProgressTab]}
          onPress={() => setActiveTab('basic')}
        >
          <View style={[styles.progressCircle, activeTab === 'basic' && styles.activeProgressCircle]}>
            <Text style={[styles.progressNumber, activeTab === 'basic' && styles.activeProgressNumber]}>1</Text>
          </View>
          <Text style={[styles.progressText, activeTab === 'basic' && styles.activeProgressText]}>Basic Info</Text>
        </TouchableOpacity>
        
        <View style={styles.progressLine} />
        
        <TouchableOpacity 
          style={[styles.progressTab, activeTab === 'sports' && styles.activeProgressTab]}
          onPress={() => validateBasicInfo() && setActiveTab('sports')}
        >
          <View style={[styles.progressCircle, activeTab === 'sports' && styles.activeProgressCircle]}>
            <Text style={[styles.progressNumber, activeTab === 'sports' && styles.activeProgressNumber]}>2</Text>
          </View>
          <Text style={[styles.progressText, activeTab === 'sports' && styles.activeProgressText]}>Sports</Text>
        </TouchableOpacity>
        
        <View style={styles.progressLine} />
        
        <TouchableOpacity 
          style={[styles.progressTab, activeTab === 'review' && styles.activeProgressTab]}
          onPress={() => {
            if (validateBasicInfo() && venueData.sportsAvailable.length > 0) {
              setActiveTab('review');
            } else if (venueData.sportsAvailable.length === 0) {
              Alert.alert('Error', 'Please add at least one sport');
            }
          }}
        >
          <View style={[styles.progressCircle, activeTab === 'review' && styles.activeProgressCircle]}>
            <Text style={[styles.progressNumber, activeTab === 'review' && styles.activeProgressNumber]}>3</Text>
          </View>
          <Text style={[styles.progressText, activeTab === 'review' && styles.activeProgressText]}>Review</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'basic' && renderBasicInfoTab()}
        {activeTab === 'sports' && renderSportsTab()}
        {activeTab === 'review' && renderReviewTab()}
        
        {/* Navigation Buttons */}
        {activeTab !== 'review' && (
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNextTab}
          >
            <Text style={styles.nextButtonText}>
              {activeTab === 'basic' ? 'Next: Add Sports' : 'Next: Review'}
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
        
        {activeTab !== 'basic' && (
          <TouchableOpacity 
            style={styles.backToButton} 
            onPress={handlePrevTab}
          >
            <MaterialIcons name="arrow-back" size={20} color={COLORS.primary} />
            <Text style={styles.backToButtonText}>
              {activeTab === 'sports' ? 'Back to Basic Info' : 'Back to Sports'}
            </Text>
          </TouchableOpacity>
        )}
        
        <View style={{height: 30}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    backgroundColor: COLORS.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  progressTab: {
    alignItems: 'center',
    flex: 1,
  },
  activeProgressTab: {
    // Active tab styling
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeProgressCircle: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  activeProgressNumber: {
    color: '#fff',
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeProgressText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  progressLine: {
    height: 2,
    backgroundColor: COLORS.primaryLight,
    width: '10%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: COLORS.text,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
  },
  required: {
    color: COLORS.error,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    marginBottom: 4,
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  addSmallButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
    minHeight: 40,
  },
  filterTag: {
    backgroundColor: COLORS.primaryLight + '20', // 20% opacity
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backToButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 15,
  },
  backToButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  sportCard: {
    backgroundColor: COLORS.background,
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sportIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sportDetails: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sportDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    gap: 5,
  },
  sportDetailText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  courtsContainer: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  courtsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
  },
  courtItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    gap: 8,
  },
  courtText: {
    fontSize: 14,
    color: COLORS.text,
  },
  reviewItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    color: COLORS.text,
  },
  reviewFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  reviewFilterTag: {
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reviewFilterText: {
    fontSize: 13,
    color: COLORS.text,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  reviewSportItem: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  reviewSportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  reviewSportDetail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
});

export default AddVenueScreen;
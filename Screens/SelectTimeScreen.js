import {Pressable, StyleSheet, Text, View, Button} from 'react-native';
import React, {useLayoutEffect, useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const SelectTimeScreen = () => {
  const route = useRoute(); // Fix: Get route from useRoute()
  const navigation = useNavigation();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] =
    useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const times = [
    {
      id: '0',
      type: 'morning',
      timings: '12 AM - 9 AM',
      icon: <Ionicons name="md-partly-sunny-outline" size={24} color="black" />,
    },
    {
      id: '1',
      type: 'Day',
      timings: '9 AM - 4 PM',
      icon: <Feather name="sun" size={24} color="black" />,
    },
    {
      id: '2',
      type: 'evening',
      timings: '4 PM - 9 PM',
      icon: <Feather name="sunset" size={24} color="black" />,
    },
    {
      id: '3',
      type: 'night',
      timings: '9 PM - 11 PM',
      icon: <Ionicons name="cloudy-night-outline" size={24} color="black" />,
    },
  ];

  const selectTime = item => {
    setSelectedSlot(item);
    setStartTime(null);
    setEndTime(null);
  };

  const showStartTimePicker = () => setStartTimePickerVisibility(true);
  const hideStartTimePicker = () => setStartTimePickerVisibility(false);

  const showEndTimePicker = () => setEndTimePickerVisibility(true);
  const hideEndTimePicker = () => setEndTimePickerVisibility(false);

  const handleConfirmStartTime = time => {
    setStartTime(time);
    hideStartTimePicker();
    setSelectedSlot(null);
  };

  const handleConfirmEndTime = time => {
    setEndTime(time);
    hideEndTimePicker();
    setSelectedSlot(null);
  };

  useEffect(() => {
    if ((startTime && endTime) || selectedSlot) {
      const formattedStartTime = startTime ? formatTime(startTime) : selectedSlot?.timings.split(' - ')[0];
      const formattedEndTime = endTime ? formatTime(endTime) : selectedSlot?.timings.split(' - ')[1];
      const timeInterval = `${formattedStartTime} - ${formattedEndTime}`;

      navigation.setOptions({
        headerRight: () => (
          <Button
            onPress={() => {
              if (route.params?.onSelectTime) {
                route.params.onSelectTime(timeInterval);
              }
              navigation.goBack();
            }}
            title="Select"
          />
        ),
      });
    }
  }, [startTime, endTime, selectedSlot, navigation, route]);

  const formatTime = time => {
    if (!time) return 'Select Time';
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Select Suitable Time',
      headerTitleStyle: {fontSize: 20, fontWeight: 'bold'},
    });
  }, []);

  return (
    <View>
      <View style={styles.timeSlotContainer}>
        {times.map(item => (
          <Pressable
            key={item.id}
            onPress={() => selectTime(item)}
            style={[
              styles.timeSlot,
              selectedSlot?.id === item.id && styles.selectedSlot,
            ]}>
            {item.icon}
            <Text>{item.type}</Text>
            <Text>{item.timings}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <Text style={styles.label}>Start Time:</Text>
          <Button title={formatTime(startTime)} onPress={showStartTimePicker} />
          <DateTimePickerModal
            isVisible={isStartTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmStartTime}
            onCancel={hideStartTimePicker}
            is24Hour={false}
          />
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.label}>End Time:</Text>
          <Button title={formatTime(endTime)} onPress={showEndTimePicker} />
          <DateTimePickerModal
            isVisible={isEndTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmEndTime}
            onCancel={hideEndTimePicker}
            is24Hour={false}
          />
        </View>

        {(startTime && endTime) || selectedSlot ? (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Selected Interval:{' '}
              {selectedSlot
                ? selectedSlot.timings
                : `${formatTime(startTime)} - ${formatTime(endTime)}`}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default SelectTimeScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  timeSlot: {
    backgroundColor: 'white',
    margin: 10,
    width: 160,
    height: 120,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedSlot: {
    backgroundColor: '#d3e9ff',
    borderColor: '#007bff',
  },
  timeContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

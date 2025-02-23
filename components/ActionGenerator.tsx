import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Button } from 'react-native';

interface Action {
  type: 'task' | 'event' | 'note';
  text: string;
  date?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface ActionGeneratorProps {
  actions: Action[];
}

export const ActionGenerator: React.FC<ActionGeneratorProps> = ({ actions }) => {
  const requestCalendarPermissions = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      return true;
    }
    Alert.alert('Permission Required', 'Calendar permission is required to create events');
    return false;
  };

  const handleCreateEvent = async (action: Action) => {
    try {
      const hasPermission = await requestCalendarPermissions();
      if (!hasPermission) return;

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar found');
        return;
      }

      const eventDate = action.date ? new Date(action.date) : new Date();

      await Calendar.createEventAsync(defaultCalendar.id, {
        title: action.text,
        startDate: eventDate,
        endDate: new Date(eventDate.getTime() + 60 * 60 * 1000), // 1 hour duration
        timeZone: 'default',
        alarms: [{
          relativeOffset: -30, // 30 minutes before
          method: Calendar.AlarmMethod.ALERT,
        }],
      });

      Alert.alert('Success', 'Event created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create event');
      console.error(error);
    }
  };

  const handleCreateTask = async (action: Action) => {
    // Implement task creation logic (e.g., using a todo list API)
    Alert.alert('Task Created', action.text);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Actions</ThemedText>
      {actions.map((action, index) => (
        <ThemedView key={index} style={styles.actionContainer}>
          <ThemedText>{action.text}</ThemedText>
          <View style={styles.buttonContainer}>
            {action.type === 'event' && (
              <Button
                title="Create Event"
                onPress={() => handleCreateEvent(action)}
              />
            )}
            {action.type === 'task' && (
              <Button
                title="Create Task"
                onPress={() => handleCreateTask(action)}
              />
            )}
          </View>
        </ThemedView>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  actionContainer: {
    padding: 8,
    gap: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

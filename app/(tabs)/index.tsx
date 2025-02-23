import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { ActionExtractor } from '@/components/ActionExtractor';
import { ActionGenerator } from '@/components/ActionGenerator';
import { ThemedView } from '@/components/ThemedView';

interface Action {
  type: 'task' | 'event' | 'note';
  text: string;
  date?: string;
  priority?: 'high' | 'medium' | 'low';
}

export default function HomeScreen() {
  const [transcript, setTranscript] = useState('');
  const [actions, setActions] = useState<Action[]>([]);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <VoiceRecorder setTranscript={setTranscript} />
        <ActionExtractor
          transcript={transcript}
          onActionsExtracted={setActions}
        />
        <ActionGenerator actions={actions} />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 16,
  },
});

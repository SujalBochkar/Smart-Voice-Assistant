import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface VoiceRecorderProps {
  setTranscript: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ setTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [localTranscript, setLocalTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupVoice = async () => {
      try {
        await Voice.isAvailable();
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;
      } catch (e) {
        setError('Voice recognition not available');
      }
    };

    setupVoice();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (event: SpeechResultsEvent) => {
    const text = event.value?.[0] ?? '';
    setLocalTranscript(text);
    setTranscript(text);
  };

  const onSpeechError = (error: any) => {
    setError(`Error: ${error.message}`);
  };

  const startRecording = async () => {
    setError(null);
    setIsRecording(true);
    try {
      await Voice.start('en-US');
    } catch (error) {
      setError('Failed to start recording');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      setError('Failed to stop recording');
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Voice Recorder</ThemedText>
      <View style={styles.buttonContainer}>
        <Button
          title={isRecording ? "Stop Recording" : "Start Recording"}
          onPress={isRecording ? stopRecording : startRecording}
          color={isRecording ? "#ff4444" : "#4444ff"}
        />
      </View>
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
      {localTranscript && (
        <ThemedView style={styles.transcriptContainer}>
          <ThemedText type="defaultSemiBold">Transcript:</ThemedText>
          <ThemedText>{localTranscript}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  error: {
    color: '#ff4444',
  },
  transcriptContainer: {
    padding: 8,
    gap: 8,
  },
});

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import nlp from 'compromise';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface Action {
  type: 'task' | 'event' | 'note';
  text: string;
  date?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface ActionExtractorProps {
  transcript: string;
  onActionsExtracted?: (actions: Action[]) => void;
}

export const ActionExtractor: React.FC<ActionExtractorProps> = ({
  transcript,
  onActionsExtracted
}) => {
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    if (!transcript) return;

    const doc = nlp(transcript);

    // Extract tasks (sentences with action verbs)
    const tasks = doc.match('(need|must|should|have to|will) #Verb').out('array');

    // Extract dates
    const dates = doc.dates().out('array');

    // Extract events (sentences with time indicators)
    const events = doc.match('(meeting|call|appointment|session) (at|on|in) #Date').out('array');

    const extractedActions: Action[] = [
      ...tasks.map(task => ({ type: 'task', text: task, priority: 'medium' })),
      ...events.map(event => ({
        type: 'event',
        text: event,
        date: dates[0] // Simplified - you'd want better date matching
      }))
    ];

    setActions(extractedActions);
    onActionsExtracted?.(extractedActions);
  }, [transcript]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Extracted Actions</ThemedText>
      {actions.length === 0 ? (
        <ThemedText>No actions extracted yet</ThemedText>
      ) : (
        actions.map((action, index) => (
          <ThemedView key={index} style={styles.actionItem}>
            <ThemedText type="defaultSemiBold">
              {action.type.toUpperCase()}:
            </ThemedText>
            <ThemedText>{action.text}</ThemedText>
            {action.date && (
              <ThemedText style={styles.date}>Date: {action.date}</ThemedText>
            )}
          </ThemedView>
        ))
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  actionItem: {
    padding: 8,
    gap: 4,
    borderRadius: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});

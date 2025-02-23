import { ActionExtractor } from "@/components/ActionExtractor";
import { ActionGenerator } from "@/components/ActionGenerator";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
// import { VoiceRecorder } from './components/VoiceRecorder';
// import { ActionExtractor } from './components/ActionExtractor';
// import { ActionGenerator } from './components/ActionGenerator';

// Define the Action interface
interface Action {
  type: "task" | "event" | "note";
  text: string;
  date?: string;
  priority?: "high" | "medium" | "low";
}

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [actions, setActions] = useState<Action[]>([]);

  return (
    <SafeAreaView style={styles.container}>
      <VoiceRecorder setTranscript={setTranscript} />
      <ActionExtractor
        transcript={transcript}
        onActionsExtracted={setActions}
      />
      <ActionGenerator actions={actions} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default App;

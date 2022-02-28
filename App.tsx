import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TestScreen from "./src";
import {Navigation} from "./src/navigation";

export default function App() {
  return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <Navigation />
        </SafeAreaView>
      </SafeAreaProvider>
    // <View style={styles.container}>
    //   <Text>Open up App.tsx to start working on your app!</Text>
    //   <TestScreen />
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF5236'
  },
});

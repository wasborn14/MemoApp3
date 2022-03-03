import {SafeAreaView, StyleSheet} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Navigation} from "./src/navigation";
import { firebaseConfig } from './env';
import firebase from "firebase";

require('firebase/firestore');

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

export default function App() {
  return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <Navigation />
        </SafeAreaView>
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF5236'
  },
});

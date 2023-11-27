// Import necessary dependencies from React, React Native, and third-party libraries
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert } from 'react-native';
import { useReadReceipts } from '../../ReadReceiptsContext';
import themeContext from '../../theme/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store'

// Functional component for managing read receipt settings
export default function ReadReceiptsSettings({ navigation }) {
  // Access the readReceiptsEnabled state and the setReadReceiptsEnabled function from the NotificationContext
  const { readReceiptsEnabled, setReadReceiptsEnabled } = useReadReceipts();
  console.log("READ RECEIPTS ENABLED", readReceiptsEnabled)

//   // State variables for managing UI and temporary states
//   const [isAlertDisplayed, setIsAlertDisplayed] = useState(false);

  // Access the theme from the themeContext
  const theme = useContext(themeContext);

  // useEffect to fetch read receipt settings when the component mounts
  useEffect(() => {
    async function fetchReadReceiptsSetting() {
      // Fetch read receipt settings from the server using axios
      const tokenVal = await SecureStore.getItemAsync('token');
      //console.log("GETTING TOKEN VAL", tokenVal)
      const response = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getReadReceiptsSettings', {
          params: {
            token: tokenVal,
          },
        })
        .catch((error) => {
          if (error.response) {
            return error.response.data;
          }
        });

      // Update readReceiptsEnabled state if the server response contains the relevant data
      if (response && response.data && response.data.readReceiptsEnabled !== undefined) {
        setReadReceiptsEnabled(response.data.readReceiptsEnabled);
      }
      //console.log("RESPONSE", response)
    }

    // Call the fetchReadReceiptSetting function
    fetchReadReceiptsSetting();
  }, []);

  // Function to toggle the read receipt switch and update the server and local storage
  const toggleReadReceiptsSwitch = async () => {
    // Update readReceiptsEnabled state

    setReadReceiptsEnabled((prevState) => !prevState);

    // Get user token from async storage
    const tokenVal = await SecureStore.getItemAsync('token');

    try {
      // Make an API request to update read receipt settings
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/readReceiptsSettings', {
          token: tokenVal,
          readReceiptsEnabled: !readReceiptsEnabled,
        }
      );

      // Handle success or failure based on the API response
      if (response.status === 200 && response.data.success) {
        console.log('Read receipt preferences updated');
      } else {
        console.log('Read receipt preferences not updated');
        //setIsAlertDisplayed(true);
      }
    } catch (error) {
      console.log('Error in toggleReadReceiptSwitch:', error);
    }
  };

  // Function to navigate back to the user's profile
  const navigateToProfile = () => {
    navigation.goBack();
  };

  // JSX rendering of the component's UI
  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.switchContainer}>
        <Text style={[styles.subtitle, { color: theme.color }]}>Enable Read Receipts?</Text>
        <Switch
          value={readReceiptsEnabled}
          onValueChange={toggleReadReceiptsSwitch}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={navigateToProfile}>
        <Text style={styles.buttonText}>Go Back to Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    marginTop: 400,
    flex: 1,
    justifyContent: 'flex-start', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  switchContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 15,
    alignSelf: 'center',
  },
  button: {
    width: '40%',
    height: 40,
    backgroundColor: 'gold',
    borderRadius: 6,
    justifyContent: 'center',
    margin: 10,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 8,
  },
});

import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Switch,TouchableOpacity, ScrollView, Modal, Pressable, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { useNotification } from '../../NotificationContext';
import { EventRegister } from 'react-native-event-listeners';
import themeContext from '../../theme/themeContext';
import theme from '../../theme/theme';
import  AsyncStorage from '@react-native-async-storage/async-storage';





export default function NotificationSettings({navigation}) {

    const { notificationsEnabled, setNotificationsEnabled } = useNotification();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState(false);
    const [temporaryNotificationsEnabled, setTemporaryNotificationsEnabled] = useState(notificationsEnabled);
    const [darkMode, setDarkMode] = useState(false);
    const [showDarkModePopup, setShowDarkModePopup] = useState(false);
    const theme = useContext(themeContext)
    useEffect(() => {
        console.log("isAlert", isAlertDisplayed);
        async function fetchNotificationSetting() {
          if (isAlertDisplayed) {
            return; // If an alert is displayed, don't toggle the switch
          }
          setTemporaryNotificationsEnabled((prevState) => !prevState);

          const tokenVal = await SecureStore.getItemAsync('token');
          const response = await axios.get(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getNoti', {
            params :{
            token: tokenVal,
            }
          }).catch((error) => {
            if (error.response) {
              return error.response.data;
            }
          });
          console.log("after response")
          //console.log(response)
          console.log(response.data)
          if (response.data.recieveNotifications === undefined) {
            console.log("not undefined");
          }
          console.log(response.data.notificationsEnabled)
          if (response && response.data && response.data.notificationsEnabled !== undefined) {
            setNotificationsEnabled(response.data.notificationsEnabled);
            console.log(notificationsEnabled)
          }
        }
    
        fetchNotificationSetting();
      }, []);

      useEffect(() => {
        console.log("inside useEffect darkmode")
        // Retrieve the Dark Mode state from AsyncStorage
        AsyncStorage.getItem('darkModeEnabled')
          .then((darkModeStatus) => {
            if (darkModeStatus === 'true') {
              console.log("dark mode true")
              setDarkMode(true);
            } else {
              console.log("dark mode false")
              setDarkMode(false);
            }
          })
          .catch((error) => {
            console.error('Error retrieving Dark Mode status:', error);
          });
      }, [darkMode]);
    
    const toggleNotificationSwitch = async () => {
        //console.log(notificationsEnabled)
      // Update the state to enable or disable notifications
      setNotificationsEnabled((prevState) => !prevState);
      // You can also send this setting to your server or save it locally.
      const recieveNotifications = !notificationsEnabled;
      console.log(recieveNotifications)
      const tokenVal = await SecureStore.getItemAsync('token')
      try {
      const response  = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/notiSettings', {
          token: tokenVal,
          //this is where I last left off
          recieveNotifications: recieveNotifications,
        });
        if (response.status === 200 && response.data.success) {
          // Success response
          console.log("Notification preferences updated");
        } else {
          // Handle any other cases as needed
          console.log("Notification preferences not updated");
          setIsAlertDisplayed(true);
        }
      } catch (error) {
        console.log("Error in toggleNotificationSwitch:", error);
        setIsAlertDisplayed(true);
        Alert.alert('Unable to update notifications', null, [
          {
            text: 'OK',
            onPress: () => {
              setIsAlertDisplayed(false);
              // Reset the temporary state to the previous value
              console.log("tempnoti", temporaryNotificationsEnabled)
              setNotificationsEnabled((prevState) => !prevState);
              //setNotificationsEnabled(temporaryNotificationsEnabled);
              console.log("tempnoti after", temporaryNotificationsEnabled)
            },
          },
          ]);
      }
        /*
        .catch((error) => {
          console.log("Error in toggleNotificationSwitch:", error);

      // Display the alert only if there is an error in the API request
      setIsAlertDisplayed(true);
      Alert.alert('Unable to update notifications', null, [
        {
          text: 'OK',
          onPress: () => {
            setIsAlertDisplayed(false);
            // Reset the temporary state to the previous value
            setTemporaryNotificationsEnabled(notificationsEnabled);
          },
        },
        ]);
        })
        */
      };

    const navigateToProfile = () => {
        navigation.goBack()
      }
  
    return (
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <View style={styles.switchContainer}>
        <Text style={[styles.subtitle,{color:theme.color}]}>Allow Notifications?</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotificationSwitch}
          disabled={isAlertDisplayed}
        />
        </View>
        <View style={styles.switchContainer}>
        <Text style={[styles.subtitle, {color:theme.color}]}>Switch Color Themes?</Text>
        <Switch
          value={darkMode}
          onValueChange={(value) => {
            setDarkMode(value);
            AsyncStorage.setItem('darkModeEnabled', value.toString())
            EventRegister.emit('ChangeTheme', value)
            //setShowDarkModePopup(AsyncStorage.getItem('darkModeEnabled'))

            Alert.alert(`You are now in ${(darkMode) ? 'light' : 'dark'} mode`, null, [
              {
                text: 'OK',
                onPress: () => {
                  setShowDarkModePopup(false);
                  // Reset the temporary state to the previous value
                },
              },
              ]);
          }
          }
        />
        </View>
        <TouchableOpacity style={styles.button} onPress={navigateToProfile}>
        <Text style={styles.buttonText}>Go Back to Profile</Text>
        </TouchableOpacity>
        
      </View>
    );
  }
  
const styles = StyleSheet.create({
  buttonText: {
    fontSize: 15,
    alignSelf: "center"
  },
  container: {

    flex: 1,
    justifyContent: 'flex-start', // Center vertically
    alignItems: 'center',     // Center horizontally
  },
  switchContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 0,
  },
  button: {
    width: "40%",
    height: 40,
    backgroundColor: "gold",
    borderRadius: 6,
    justifyContent: 'center',
    margin: 10,
    alignSelf: 'center'    
  },
  modalView: {
    flex:1,
    marginTop:50,
    padding:20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: 'gold',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 8
  },
  
  scrollView: {
    marginVertical:50,
    marginHorizontal:15,
  }
  
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    marginBottom: 20,
  }
}
);

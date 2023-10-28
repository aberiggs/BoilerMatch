import React, { useEffect, useState } from 'react';
import axios from "axios";
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, Switch,TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';




export default function NotificationSettings({navigation}) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
    const toggleNotificationSwitch = async () => {
        //console.log(notificationsEnabled)
      // Update the state to enable or disable notifications
      setNotificationsEnabled((prevState) => !prevState);
      // You can also send this setting to your server or save it locally.
      const recieveNotifications = !notificationsEnabled;
      console.log(recieveNotifications)
      const tokenVal = await SecureStore.getItemAsync('token')
        const response  = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/notifications', {
          token: tokenVal,
          //this is where I last left off
          //pushToken: expoPushToken,
          recieveNotifications: recieveNotifications,
        }).catch((error) => {
          if (error.response) {
            return error.response.data
          }
          return
        })
    
        return response
    };
    const navigateToProfile = () => {
        navigation.goBack()
      }
  
    return (
      <View style={styles.container}>
        <View style={styles.switchContainer}>
        <Text style={styles.subtitle}>Allow Notifications?</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotificationSwitch}
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
    marginBottom: 600,
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

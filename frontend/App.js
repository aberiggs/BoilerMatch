import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './screens/Landing'
import Register from './screens/LoginRegister/Register'
import Login from './screens/LoginRegister/Login'

import MainTabNavigator from './routes/MainTabNavigator';

import ManageInformation from './screens/Profile/ManageInformation';
import ManageNotifications from './screens/Profile/ManageNotifications';
import ManageHousingInformation from './screens/Profile/ManageHousingInformation';
import Profile from './screens/Profile/Profile';

import ManagePreferences from './screens/Profile/ManagePreferences';
import ManagePreferenceRankings from './screens/Profile/RankPreferences';

import ForgotPassword from './screens/LoginRegister/ForgotPassword';
import PinVerify from './screens/LoginRegister/PinVerify';
import ResetPassword from './screens/LoginRegister/ResetPassword';
import NotificationProvider from './NotificationContext';
import MainFeed from './screens/MainFeed/MainFeed';
import { EventRegister } from 'react-native-event-listeners';
import theme from './theme/theme';
import themeContext from './theme/themeContext';


const Stack = createStackNavigator();

export default function App() {

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const listener = EventRegister.addEventListener('ChangeTheme', (data) => {
      setDarkMode(data)
      console.log("darkMode", data);
    })
    return ()=> {
      EventRegister.removeAllListeners(listener)
    }
  }, [darkMode])
  return (
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
    <NotificationProvider>
    <NavigationContainer theme={darkMode === true ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name = "Register" component={Register} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back", title: ""
        }}/>
        <Stack.Screen name = "Login" component={Login} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="PinVerify" component={PinVerify} />
        <Stack.Screen name="MainFeed" component={MainFeed} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{gestureEnabled: false}}/>
        <Stack.Screen name="ManageInformation" component={ManageInformation} />
        <Stack.Screen name="ManageHousingInformation" component={ManageHousingInformation} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ManagePreferences" component={ManagePreferences} />
        <Stack.Screen name="ManageNotifications" component={ManageNotifications}/>
        <Stack.Screen name="ManagePreferenceRankings" component={ManagePreferenceRankings} />
      </Stack.Navigator>
    </NavigationContainer>
    </NotificationProvider>
    </themeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

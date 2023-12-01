import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './screens/Landing'
import Register from './screens/LoginRegister/Register'
import Login from './screens/LoginRegister/Login'
import Getstarted from './screens/LoginRegister/Getstarted'

import MainTabNavigator from './routes/MainTabNavigator';

import ManageInformation from './screens/Profile/ManageInformation';
import ManageNotifications from './screens/Profile/ManageNotifications';
import ManageHousingInformation from './screens/Profile/ManageHousingInformation';
import Profile from './screens/Profile/Profile';

import ManagePreferences from './screens/Profile/ManagePreferences';
import ManagePreferenceRankings from './screens/Profile/RankPreferences';
import ManagePhotos from './screens/Profile/ManagePhotos';
import BlockedUsers from './screens/Profile/BlockedUsers';
import ForgotPassword from './screens/LoginRegister/ForgotPassword';
import PinVerify from './screens/LoginRegister/PinVerify';
import ResetPassword from './screens/LoginRegister/ResetPassword';
import NotificationProvider from './NotificationContext';
import ReadReceiptsProvider from './ReadReceiptsContext';
import MainFeed from './screens/MainFeed/MainFeed';
import { EventRegister } from 'react-native-event-listeners';
import theme from './theme/theme';
import themeContext from './theme/themeContext';

import Settings from './screens/Settings/Settings'
import UpdateCredentials from './screens/Settings/UpdateCredentials'
import ReportFeedback from './screens/Settings/ReportFeedback'
import VerifyForUsername from './screens/Settings/VerifyForUsername'
import VerifyForPassword from './screens/Settings/VerifyForPassword'
import UpdateUsername from './screens/Settings/UpdateUsername'
import UpdatePassword from './screens/Settings/UpdatePassword'
import DeleteAccount from './screens/Settings/DeleteAccount'
import Confirmation from './screens/Settings/Confirmation'
import ReadReceiptsOptions from './screens/Settings/ReadReceiptsOptions'


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

  // TODO: Move/organize all these stack screens to individual navigation containers within other screens of the app

  return (
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
    <NotificationProvider>
    <ReadReceiptsProvider>
    <NavigationContainer theme={darkMode === true ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name = "Register" component={Register} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back", title: ""
        }}/>
        <Stack.Screen name = "Login" component={Login} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name = "Getstarted" component={Getstarted} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="PinVerify" component={PinVerify} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="MainFeed" component={MainFeed} />
        <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{gestureEnabled: false}}/>
        <Stack.Screen name="ManageInformation" component={ManageInformation} />
        <Stack.Screen name="ManageHousingInformation" component={ManageHousingInformation} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ManagePreferences" component={ManagePreferences} />
        <Stack.Screen name="ManageNotifications" component={ManageNotifications}/>
        <Stack.Screen name="ManagePreferenceRankings" component={ManagePreferenceRankings} />
        <Stack.Screen name="Settings" component={Settings} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="UpdateCredentials" component={UpdateCredentials} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="ReportFeedback" component={ReportFeedback} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="VerifyForUsername" component={VerifyForUsername} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="VerifyForPassword" component={VerifyForPassword} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="UpdateUsername" component={UpdateUsername} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="Confirmation" component={Confirmation} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="ManagePhotos" component={ManagePhotos} />
        <Stack.Screen name="BlockedUsers" component={BlockedUsers}  options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>

        <Stack.Screen name="ReadReceiptsOptions" component={ReadReceiptsOptions} />
      </Stack.Navigator>
    </NavigationContainer>
    </ReadReceiptsProvider>
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

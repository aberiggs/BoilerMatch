import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './screens/Landing'
import Register from './screens/LoginRegister/Register'
import Login from './screens/LoginRegister/Login'

import MainTabNavigator from './routes/MainTabNavigator';

import ManageInformation from './screens/Profile/ManageInformation';
import ManageHousingInformation from './screens/Profile/ManageHousingInformation';
import Profile from './screens/Profile/Profile';

import ManagePreferences from './screens/Profile/ManagePreferences';
import ManagePreferenceRankings from './screens/Profile/RankPreferences';
import ManagePhotos from './screens/Profile/ManagePhotos';

import ForgotPassword from './screens/LoginRegister/ForgotPassword';
import PinVerify from './screens/LoginRegister/PinVerify';
import ResetPassword from './screens/LoginRegister/ResetPassword';


const Stack = createStackNavigator();

export default function App() {
  // TODO: Move/organize all these stack screens to individual navigation containers within other screens of the app
  return (
    <NavigationContainer>
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
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{gestureEnabled: false}}/>
        <Stack.Screen name="ManageInformation" component={ManageInformation} />
        <Stack.Screen name="ManageHousingInformation" component={ManageHousingInformation} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ManagePreferences" component={ManagePreferences} />
        <Stack.Screen name="ManagePreferenceRankings" component={ManagePreferenceRankings} />
        <Stack.Screen name="ManagePhotos" component={ManagePhotos} />
      </Stack.Navigator>
    </NavigationContainer>
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

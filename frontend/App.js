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

import ForgotPassword from './screens/LoginRegister/ForgotPassword';
import PinVerify from './screens/LoginRegister/PinVerify';
import ResetPassword from './screens/LoginRegister/ResetPassword';

import Settings from './screens/Settings/Settings'
import UpdateCredentials from './screens/Settings/UpdateCredentials'
import ReportFeedback from './screens/Settings/ReportFeedback'
import VerifyForUsername from './screens/Settings/VerifyForUsername'
import VerifyForPassword from './screens/Settings/VerifyForPassword'
import UpdateUsername from './screens/Settings/UpdateUsername'
import UpdatePassword from './screens/Settings/UpdatePassword'
import DeleteAccount from './screens/Settings/DeleteAccount'
import Confirmation from './screens/Settings/Confirmation'


const Stack = createStackNavigator();

export default function App() {
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
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="PinVerify" component={PinVerify} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{
          headerShown:true,  headerShadowVisible: true, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{gestureEnabled: false}}/>
        <Stack.Screen name="ManageInformation" component={ManageInformation} />
        <Stack.Screen name="ManageHousingInformation" component={ManageHousingInformation} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ManagePreferences" component={ManagePreferences} />
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

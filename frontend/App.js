import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './screens/Landing'
import Register from './screens/Register'
import Login from './screens/Login'

import MainTabNavigator from './routes/MainTabNavigator';
import ForgotPassword from './screens/ForgotPassword';
import pinVerify from './screens/pinVerify';
import ResetPassword from './screens/ResetPassword';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false
    }}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name = "Register" component={Register} options={{
          headerShown:true,  headerShadowVisible: false, headerBackTitle: "Back", title: ""
        }}/>
        <Stack.Screen name = "Login" component={Login} options={{
          headerShown:true,  headerShadowVisible: false, headerBackTitle: "Back",  title: ""
        }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="pinVerify" component={pinVerify} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />

      <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
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

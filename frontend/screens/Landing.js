import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import { useEffect } from 'react';

export default function Landing({navigation}){

    useEffect(() => {
        handleRemember()
    }, [])

    const handleRemember = async () => {
      const tokenVal = await SecureStore.getItemAsync('token')
      const usernameVal = await SecureStore.getItemAsync('username')

      if (!tokenVal || !usernameVal) {
          return
      }

      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/verifylanding', {
        token: tokenVal,
      }).catch((error) => {
        if (error.response) {
          return error.response.data
        }

        return
      })

      if (response.data.success) {
        navigation.navigate("MainTabNavigator")
      }
    }

    const handleLogin = () => {
        navigation.navigate("Login")
      }
      const handleRegister = () => {
        navigation.navigate("Register")
      }

    return(
        <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
       </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
   
   

    },
      button: {
        width: "40%",
        height: 50,
        backgroundColor: 'gold',
        borderRadius: 6,
        justifyContent: 'center',
        marginTop: 30
        
      },
      buttonText: {
        fontSize: 20,
        alignSelf: "center"
      },
  });
  
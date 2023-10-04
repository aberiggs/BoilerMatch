import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from "axios"

export default function Login({navigation}){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [stayLoggedIn, setStayLoggedIn] = useState(false)

    const loginThroughApi = async () => {
        const response = await axios.post('http://localhost:3000/api/user/login', {
          username: username,
          password: password,
        }).catch((error) => {
          if (error.response) {
            return error.response.data
          }

          return
        })

        return response
    }

    const handleLogin = async () => {
        setUsername(username.trim())
        setPassword(password.trim())
        
        const res = await loginThroughApi()

        if (!res || res.success === false) {
          if (res) {
            setErrorMessage(res.message)
          } else {
            setErrorMessage("An unexpected error occurred")
          }
        } else {
          navigation.navigate("MainTabNavigator")
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>

            <Text style={styles.subtitle}>Username</Text>

            <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"
            placeholder='Enter your username'
            placeholderTextColor={'grey'}

            onChangeText={username => setUsername(username)}

            style={styles.inputField}
            />

          <Text style={styles.subtitle}>Password</Text>

          <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"
            placeholder='Enter your password'
            placeholderTextColor={'grey'}

            onChangeText={password => setPassword(password)}

            style={styles.inputField}
          />
          
          <TouchableOpacity
          style={{ marginRight: 75, marginBottom: 5}}
            onPress={() => {
              navigation.navigate("ForgotPassword")
            }}>

            <Text style={{color: 'grey', textDecorationLine: 'underline'}}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

        <Text style={styles.errorMes}>{errorMessage}</Text>

        <View style={{flexDirection: 'row'}}>
            <Checkbox
              disabled={false}
              value={stayLoggedIn}
              onValueChange={(newValue) => setStayLoggedIn(newValue)}
            />

            <Text style={{paddingLeft: 5, paddingBottom: 10, color: 'black', fontSize: 16}}>
              Stay Logged In?
            </Text>
          </View>

        <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}> Sign in</Text>
        </Pressable>

       </View>
    )

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
        width: "40%",
        height: 50,
        backgroundColor: "gold",
        borderRadius: 6,
        justifyContent: 'center',
        
        
    },
    buttonText: {
        fontSize: 20,
        alignSelf: "center"
    },
    inputField: {
      color:'black',
      height: 40,
      width: "45%",
      borderColor: 'black',
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 25,
      marginBottom: 30,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 8,
      marginRight: 120,
    },
    errorMes: {
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 8,
      color: 'red',
      marginHorizontal: 'auto'
    }
  });
  
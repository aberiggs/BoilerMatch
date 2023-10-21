import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Checkbox from 'expo-checkbox';
import axios from "axios"

export default function Login({navigation}){

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [stayLoggedIn, setStayLoggedIn] = useState(false)
    const [showPass, setShowPass] = useState(false)

    async function save(key, value) {
      await SecureStore.setItemAsync(key, value);
    }

    const loginThroughApi = async () => {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/login', {
          username: username,
          password: password,
          stayLoggedIn: stayLoggedIn,
        }).catch((error) => {
          if (error.response) {
            return error.response.data
          }

          return
        })

        return response.data
    }

    const handleLogin = async () => {
        const resData = await loginThroughApi()

        if (!resData || resData.success === false) {
          if (resData) {
            setErrorMessage(resData.message)
          } else {
            setErrorMessage("There was an error logging in")
          }
        } else {
          const token = resData.token
          save('token', token)
          save('username', username)
          navigation.navigate("MainTabNavigator")
        }
    }

    return(
        <View style={styles.container}>
          <View style={{flex: 'column', width: "45%"}}>
            <Text style={styles.title}>Log In</Text>

            <Text style={styles.subtitle}>Username</Text>

            <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"
            placeholderTextColor={'grey'}

            onChangeText={username => setUsername(username)}

            style={styles.inputFieldBox}
            />

            <Text style={styles.subtitle}>Password</Text>


          <View style={styles.inputFieldBox}>
            <TextInput
              autoCapitalize = "none"
              autoCorrect={false}
              autoComplete="off"
              placeholderTextColor={'grey'}

              onChangeText={password => setPassword(password)}
              secureTextEntry={!showPass}

              style={styles.inputField}
            />

            <Pressable style={{position: 'absolute', paddingRight: 10}} onPress={() => setShowPass(!showPass)}>
              { showPass ?
                <Ionicons name="eye-off-outline" size={26} color="black" /> :
                <Ionicons name="eye-outline" size={26} color="black" />
              }
            </Pressable>
          </View>

        </View>
          
          <TouchableOpacity
          style={{ marginRight: 75, marginBottom: 5}}
            onPress={() => {
              navigation.push("ForgotPassword")
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
    inputFieldBox: {   
      flexDirection: 'row',
      height: 40,
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,        
    },
    inputField: {
      width: "100%",
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
  
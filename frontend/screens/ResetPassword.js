import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox';
import ForgotPassword from './ForgotPassword';
import axios from "axios"

export default function Login({navigation}){

    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const resetThroughApi = async () => {
        const response = await axios.post('http://localhost:3000/api/user/resetpassword', {
          email: ForgotPassword.email,
          password: password
        }).catch((error) => {
          if (error.response) {
            return error.response.data
          }

          return
        })

        return response
    }

    const passwordMatch = () => {
        if (password !== confirmedPassword) {
            setErrorMessage("The passwords do not match")
            return false
        }
    }

    const handleReset = async () => {
        if (passwordMatch) {
            const res = await resetThroughApi()

            if (!res || res.success === false) {
                if (res) {
                    setErrorMessage(res.message)
                } else {
                    setErrorMessage("An unexpected error occurred")
                }
            } else {
            navigation.navigate("Login")
            }
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Reset Your Password</Text>

            <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"
            placeholder='New Password'
            placeholderTextColor={'grey'}

            onChangeText={password => setPassword(password)}

            style={styles.inputField}
            />

            <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"
            placeholder='Confirm New Password'
            placeholderTextColor={'grey'}

            onChangeText={confirmedPassword => setConfirmedPassword(confirmedPassword)}

            style={styles.inputField}
            />

        <Text style={styles.errorMes}>{errorMessage}</Text>

        <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}> Reset </Text>
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
  
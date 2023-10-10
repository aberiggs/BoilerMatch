import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from "axios"

export default function ResetPassword({route, navigation}){

    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const email = route.params.email

    const resetThroughApi = async () => {
        const response = await axios.post('http://localhost:3000/api/user/resetpassword', {
          email: email,
          password: password,
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

        return true
    }

    const validatePassword = () => {
      passwordRegEx = /$^[A-Za-z]*[!?@#$]{1,}[A-Za-z]*$/
      if (password.length === 0) {
        // Password is blank or contains spaces
        setErrorMessage("Please create a password")
        return false
      } else if (password.includes(" ")) {
          setErrorMessage("Your password must not contain spaces")
          return false
      } else if (!password.match(passwordRegEx) || password.length() < 6 || password.length() > 20) {
        // Ensure a secure password
        setErrorMessage("Your password must be 6-20 characters, and contain a special character (!,?,@,#,$)")
        return false
      }

      return true
    }

    const handleReset = async () => {
        if (/*validatePassword() &&*/ passwordMatch()) {
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
          <View style={{flex: 'column', width: "45%"}}>
            <Text style={styles.subtitle}> New Password</Text>

            <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"

            onChangeText={password => setPassword(password)}

            style={styles.inputFieldBox}
            />

            <Text style={styles.subtitle}> Confirm New Password</Text>
            <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"

            onChangeText={confirmedPassword => setConfirmedPassword(confirmedPassword)}

            style={styles.inputFieldBox}
            />

            <Text style={styles.errorMes}>{errorMessage}</Text>
          </View>

        <Pressable style={styles.button} onPress={handleReset}>
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
      textAlign: 'center',
      paddingHorizontal: 10,
      marginBottom: 8,
      color: 'red',
      marginHorizontal: 'auto'
    }
  });
  
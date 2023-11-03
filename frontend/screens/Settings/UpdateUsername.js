import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import axios from "axios"

export default function UpdateUsername({route, navigation}){

    const [email, setEmail] = useState('')
    const emailExtension = "@purdue.edu"
    const [errorMessage, setErrorMessage] = useState('')
    const oldUsername = route.params.username

    const canRegister = () => {
      emailExtension = "@purdue.edu"  // Note: Change this to be @gmail.com to create account from gmail for testing purposes
      if (email.length === 0 || email.includes(" ")) {
        // Email is blank or contains spaces
        setErrorMessage("Please enter a valid email")
        return false
      } else if (email.substring(email.length-emailExtension.length, email.length) !== emailExtension || email.length-emailExtension.length === 0) {
        // Email is not *.@purdue.edu
        setErrorMessage("Please enter a valid Purdue email")
        return false
      }

      return true
    }

    const updateUsernameThroughApi = async () => {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/updateusername', {
          username: oldUsername,
          email: email,
        }).catch((error) => {
          if (error.response) {
            return error.response.data
          }

          return
        })

        return response
    }

    const handleUpdate = async () => {
      if (canRegister) {
        const res = await updateUsernameThroughApi()

        if (!res || res.success === false) {
            if (res) {
                setErrorMessage(res.message)
            } else {
                setErrorMessage("An unexpected error occurred")
            }
        } else {
            alert("Your Username has been updated!")
            await SecureStore.deleteItemAsync('token')
            await SecureStore.deleteItemAsync('username')
            navigation.navigate("Landing")
        }
      }
    }

    return(
        <View style={styles.container}>
          <View style={{flex: 'column', width: "45%"}}>
          <Text style={styles.subtitle}>New Email</Text>

          <View style={styles.inputFieldBox}>

            <TextInput 
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              placeholderTextColor={"grey"}

              onChangeText={text => setEmail(text)}

              style={styles.inputField}
            />
          </View>
          </View>

          <Text style={styles.errorMes}>{errorMessage}</Text>
        <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}> Update </Text>
        </Pressable>

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
      backgroundColor: "gold",
      borderRadius: 6,
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 20,
      alignSelf: "center"
    },
    otherText: {
      fontSize: 16,
      paddingLeft: 5
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
      textAlign: 'center',
      paddingHorizontal: 10,
      marginBottom: 8,
      color: 'red',
      marginHorizontal: 'auto'
    }
});

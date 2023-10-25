import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import axios from "axios"

export default function VerifyForUsername({navigation}){
    const verifyPasswordThroughApi = async () => {
      const username = await SecureStore.getItemAsync('username')
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/verifypassword', {
          username: username,
          password: oldPassword,
        }).catch((error) => {
          if (error.response) {
            return error.response.data
          }
        })  

        return response
    }

    const handleVerifyPassword = async () => {
        const res = await verifyPasswordThroughApi()
        const username = await SecureStore.getItemAsync('username')

        if (!res || res.success === false) {
          if (res) {
            setErrorMessage(res.message)
          } else {
            setErrorMessage("An unexpected error occurred")
          }
        } else {
          navigation.push('UpdateUsername', {
            username: username,
          });
        }
    }

    const [oldPassword, setOldPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    return(
      <View style={styles.container}>
          <View style={{flex: 'column', width: "45%"}}>
          <Text style={styles.subtitle}>Verify Current Password</Text>

          <View style={styles.inputFieldBox}>

            <TextInput 
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              placeholderTextColor={"grey"}

              onChangeText={text => setOldPassword(text)}
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
       <Text style={styles.errorMes}>{errorMessage}</Text>
        <Pressable style={styles.button} onPress={handleVerifyPassword}>
        <Text style={styles.buttonText}> Verify </Text>
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
  
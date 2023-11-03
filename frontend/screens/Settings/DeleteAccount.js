import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable , Alert} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import axios from "axios"

export default function DeleteAccount({navigation}){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [showPass, setShowPass] = useState(false)

    const deleteAccountThroughApi = async () => {
        const usernameCheck = await SecureStore.getItemAsync('username')

        if (username === usernameCheck) {
            const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/deleteaccount', {
                username: username,
                password: password,
              }).catch((error) => {
                if (error.response) {
                  return error.response.data
                }
      
                return
              })
      
              return response
        } else {
            return
        }
    }

    const handleDelete = async () => {
        const res = await deleteAccountThroughApi()

        if (!res || res.success === false) {
            if (res) {
                setErrorMessage(res.message)
            } else {
                setErrorMessage("This is not your account!")
            }
        } else {
            alert('Your account has been successfully deleted!')
            await SecureStore.deleteItemAsync('token')
            await SecureStore.deleteItemAsync('username')
            navigation.navigate("Landing")
        }
    }

    return(
        <View style={styles.container}>
          <View style={{flex: 'column', width: "45%"}}>
          <Text style={styles.title}>Delete Account</Text>
          <Text style={styles.subtitle}>Username</Text>

          <View style={styles.inputFieldBox}>

            <TextInput 
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              placeholderTextColor={"grey"}

              onChangeText={text => setUsername(text)}

              style={styles.inputField}
            />
          </View>

          <Text style={styles.subtitle}>Password</Text>

          <View style={styles.inputFieldBox}>

            <TextInput 
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              placeholderTextColor={"grey"}

              onChangeText={text => setPassword(text)}
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

          <Text style={styles.subtitle}>
            Warning: After deleting your account, 
            you will lose all the information that 
            you had before and won't be able to 
            access your account again.</Text>
          </View>

          <Text style={styles.errorMes}>{errorMessage}</Text>
        <Pressable style={styles.button} onPress={handleDelete}>
        <Text style={styles.buttonText}> Delete </Text>
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

import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import axios from "axios"

export default function ForgotPassword({navigation}){
    const forgotThroughApi = async () => {
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/forgotpassword', {
          email: email,
        }).catch((error) => {
          if (error.response) {
            return error.response.data
          }
        })  

        return response
    }

    const handleForgot = async () => {
        const res = await forgotThroughApi()

        if (!res || res.success === false) {
          if (res) {
            setErrorMessage(res.message)
          } else {
            setErrorMessage("An unexpected error occurred")
          }
        } else {
          navigation.push('pinVerify', {
            email: email,
          });
        }
    }

    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    return(
        <View style={styles.container}>
          <Text style={styles.title}>Forgot Password</Text>
          <View style={{flex: 'column', width: "45%"}}>
            
            <Text style={styles.subtitle}>Purdue Email</Text>
            <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"

            onChangeText={email => setEmail(email)}

            style={styles.inputFieldBox}
            />
          </View>
       
        <Text style={styles.errorMes}>{errorMessage}</Text>
        <Pressable style={styles.button} onPress={handleForgot}>

        <Text style={styles.buttonText}> Reset Password</Text>
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
      color:"black",
      height: 40,
      width: "45%",
      borderColor: 'black',
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
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
  
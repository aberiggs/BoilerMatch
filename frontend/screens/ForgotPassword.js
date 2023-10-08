import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';

export default function ForgotPassword({navigation}){

    const forgotThroughApi = async () => {
        const response = await axios.post('http://localhost:3000/api/user/forgotpassword', {
          email: email,
        }).catch((error) => {
          if (error.response) {
            return error.response.data
          }

          return
        })

        return response
    }

    const handleForgot = async () => {
        setEmail(email.trim())
        
        const res = await forgotThroughApi()

        if (!res || res.success === false) {
          if (res) {
            setErrorMessage(res.message)
          } else {
            setErrorMessage("An unexpected error occurred")
          }
        } else {
          navigation.navigate("pinVerify")
        }
    }

    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    return(
        <View style={styles.container}>
            <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"
            placeholder='Purdue Email'
            placeholderTextColor={"#9D968D"}

            onChangeText={email => setEmail(email)}

            style={styles.inputField}
            />
       
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
    errorMes: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 8,
        color: 'red',
        marginHorizontal: 'auto'
    }
  });
  
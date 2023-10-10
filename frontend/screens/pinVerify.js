import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import axios from "axios"

export default function PinVerify({route, navigation}){
    const [pin, setPin] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const email = route.params.email;

    const verifyThroughApi = async () => {
        const response = await axios.post('http://localhost:3000/api/user/pinverify', {
          email: email,
          pin: pin,
        }).catch((error) => {
          if (error.response) {
            return error.response.data
          }

          return
        })

        return response
    }

    const handleVerify = async () => {
        const res = await verifyThroughApi()

        if (!res || res.success === false) {
          if (res) {
            setErrorMessage(res.message)
          } else {
            setErrorMessage("An unexpected error occurred")
          }
        } else {
          navigation.push('ResetPassword', {
            email: email,
          });
        }
    }

    return(
        <View style={styles.container}>
          <View style={{flex: 'column', width: "45%"}}>
            <Text style={styles.subtitle}>Verify PIN</Text>
            <TextInput
              autoCapitalize = "none"
              autoCorrect={false}
              autoComplete="off"

              onChangeText={pin => setPin(pin)}

              style={styles.inputFieldBox}
            />
          </View>
            <Text style={styles.errorMes}>{errorMessage}</Text>

            <Pressable style={styles.button} onPress={handleVerify}>

            <Text style={styles.buttonText}> Submit </Text>
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
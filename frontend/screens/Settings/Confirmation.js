import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable , Alert} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import axios from "axios"

export default function Confirmation({navigation}){
    const [confirm, setConfirm] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleConfirm = async () => {
        const message = "I authorize BoilerMatch to delete my account"

        if (message !== confirm) {
            setErrorMessage("Message does not match. Please type it again.")
        } else {
            navigation.navigate("DeleteAccount")
        }
    }

    return(
        <View style={styles.container}>
          <View style={{flex: 'column', width: "45%"}}>
          <Text style={styles.title}>Confirmation</Text>
          <Text style={styles.subtitle}>Please type: "I authorize BoilerMatch to delete my account"</Text>

          <TextInput 
            multiline = {true}
            numberOfLines = {5}
            autoCapitalize="none"
            autoComplete='off'
            onChangeText={text => setConfirm(text)}

            style={styles.inputFieldBox}>
          </TextInput>
          </View>

          <Text style={styles.errorMes}>{errorMessage}</Text>
        <Pressable style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}> Confirm </Text>
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
        flexDirection: 'column',
        flexWrap: 'wrap',
        height: 100,
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 10,
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

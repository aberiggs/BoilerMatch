import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from "axios"

export default function Register({navigation}){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [acceptedTos, setAcceptedTos] = useState(false)


    const handleRegister = async () => {
      // Trim user credentials of whitespace
      
      // TODO: Whitespace is allowed for some reason
      const trimmedEmail = email.trim()
      const trimmedPassword = password.trim()
      const trimmedConfirmedPassword = confirmedPassword.trim()
      print(trimmedEmail.length)
      setEmail(trimmedEmail)
      setPassword(trimmedPassword)
      setConfirmedPassword(trimmedConfirmedPassword)
      if (canRegister()) {
        const res = await createAccountThroughApi()
        if (!res || res.success === false) {
          if (res) {
            console.log(res.message)
          } else {
            setErrorMessage("An unexpected error occurred")
          }
        } else {
          navigation.navigate("Landing")
        }
      }
    }

    const createAccountThroughApi = async () => {
      // TODO: .env for dev/production environments
      const response = await axios.post('http://localhost:3000/api/user/register', {
          email: email,
          password: password,
      }).catch(error => {
        console.log("Error occurred when creating user account:", error)
        return
      })

      return response
    }

    const canRegister = () => {
      emailExtension = "@purdue.edu"  // Note: Change this to be @gmail.com to create account from gmail for testing purposes
      if (email.length === 0) {
        // Email is blank
        setErrorMessage("Please enter your email")
        return false
      } else if (password.length === 0) {
        // Password is blank
        setErrorMessage("Please create a password")
        return false
      } else if (confirmedPassword.length === 0) {
        // Confirmed password is blank
        setErrorMessage("Please confirm your password")
        return false
      } else if (email.substring(email.length-emailExtension.length, email.length) !== emailExtension || email.length-emailExtension.length === 0) {
        // Email is not *.@purdue.edu
        setErrorMessage("Please enter a valid Purdue email")
        return false
      } else if (password !== confirmedPassword) {
        // Passwords do not match
        setErrorMessage("The passwords do not match")
        return false
      } else if (acceptedTos !== true){
        // User didn't accept TOS
        setErrorMessage("Please accept the Terms of Service")
        return false
      }

      return true
    }

    const updateAndValidate = (newText, updateFunc) => {
      () => setConfirmedPassword(newText)
      console.log(confirmedPassword)
    }

    return(
      <View style={styles.container}>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            placeholder='Purdue Email'
            placeholderTextColor={"#9D968D"}
            
            onChangeText={text => setEmail(text)}

            style={styles.textInput}
          />

          <TextInput 
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            placeholder='Password'
            placeholderTextColor={"#9D968D"}

            onChangeText={text => setPassword(text)}

            style={styles.textInput}
          />

          <TextInput 
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            placeholder='Confirm Password'
            placeholderTextColor={"#9D968D"}

            onChangeText={ text => setConfirmedPassword(text)}

            style={styles.textInput}
          />

          <View style={{
            flexDirection: 'row'
          }}> 
            <Checkbox
              disabled={false}
              value={acceptedTos}
              onValueChange={(newValue) => setAcceptedTos(newValue)}
            />

            <Text style={styles.otherText}>I agree to the BoilerMatch Terms</Text>
          </View>
          

          <Text style={styles.buttonText}>{errorMessage}</Text>
       
          <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
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
      otherText: {
        fontSize: 15,
        paddingLeft: 5
      },
      textInput: {
        color:"#CEB888",
        height: 40,
        width: "45%",
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
      }
      
  });
  
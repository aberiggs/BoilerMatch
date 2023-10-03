import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable } from 'react-native';
import axios from "axios"

export default function Login({navigation}){

    const canLogin = () => {
        
    }

    const loginThroughApi = async () => {
        const response = await axios.post('http://localhost:3000/api/user/login', {
          username: username,
          password: password,
        }).catch((error) => {
          if (error.response) {
            return error.response.data
          }

          return
        })

        return response
    }

    const handleLogin = async () => {
        setUsername(username.trim())
        setPassword(password.trim())
        
        const res = await loginThroughApi()

        if (!res || res.success === false) {
          if (res) {
            console.log(res.message)
          }
        } else {
          navigation.navigate("MainTabNavigator")
        }
    }
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return(
        <View style={styles.container}>
            <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"
            placeholder='Username'
            placeholderTextColor={"#9D968D"}

            onChangeText={username => setUsername(username)}

            style={styles.inputField}
            />

          <TextInput
            autoCapitalize = "none"
            autoCorrect={false}
            autoComplete="off"
            placeholder='Password'
            placeholderTextColor={"#9D968D"}

            onChangeText={password => setPassword(password)}

            style={styles.inputField}
          />
          
          <TouchableOpacity
          style={{ marginBottom: 10}}
            onPress={() => {
              navigation.navigate("ForgotPassword")
            }}>

            <Text style={{color: '#9D968D', textDecorationLine: 'underline'}}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
       
        <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}> Sign in</Text>
        </Pressable>
      
       </View>
    )

}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#373A36',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
        width: "40%",
        height: 50,
        backgroundColor: "#CEB888",
        borderRadius: 6,
        justifyContent: 'center',
        
        
    },
    buttonText: {
        fontSize: 20,
        alignSelf: "center"
    },
    inputField: {
      color:"#CEB888",
      height: 40,
      width: "45%",
      borderColor: '#CEB888',
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
  });
  
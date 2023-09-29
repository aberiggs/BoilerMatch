import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput } from 'react-native';

export default function Login({navigation}){

    const handleLogin = () => {
        navigation.navigate("MainTabNavigator")
    }
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return(
        <View style={styles.container}>
        <TextInput
          autoCapitalize = "none"
          autoCorrect={false}
          autoComplete={false}
          placeholder='Username'
          placeholderTextColor={"#9D968D"}

          style={{
            color:"#CEB888",
            height: 40,
            width: "45%",
            borderColor: '#CEB888',
            borderWidth: 1,
            padding: 10,
            marginBottom: 20,
            borderRadius: 5,
          }}
        />

        <TextInput
          autoCapitalize = "none"
          autoCorrect={false}
          autoComplete={false}
          placeholder='Password'
          placeholderTextColor={"#9D968D"}

          style={{
            color:"#CEB888",
            height: 40,
            width: "45%",
            borderColor: '#CEB888',
            borderWidth: 1,
            padding: 10,
            marginBottom: 20,
            borderRadius: 5,
          }}
        />
       
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}> Sign in</Text>
        </TouchableOpacity>
      
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
      
  });
  
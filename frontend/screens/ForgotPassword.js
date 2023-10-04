import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default function ForgotPassword({navigation}){

    const handleLogin = () => {
        navigation.navigate("MainTabNavigator")
    }
    
    const [email, setEmail] = useState('')

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
       
        <Pressable style={styles.button}
        onPress={() => {
            //send email
        }}>

        <Text style={styles.buttonText}> Reset Password</Text>
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
  
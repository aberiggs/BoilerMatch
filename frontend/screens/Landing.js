import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';

export default function Landing({navigation}){


    const handleLogin = () => {
        navigation.navigate("Login")
      }
      const handleRegister = () => {
        navigation.navigate("Register")
      }

    return(
        <View style={styles.container}>

       
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
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
        marginTop: 30
        
      },
      buttonText: {
        fontSize: 20,
        alignSelf: "center"
      },
  });
  
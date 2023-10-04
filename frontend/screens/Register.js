import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';

export default function Register({navigation}){

    const handleRegister = () => {
        navigation.navigate("MainTabNavigator")
      }

    return(
        <View style={styles.container}>

       
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}> Register</Text>
        </TouchableOpacity>
      
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
        backgroundColor: "#CEB888",
        borderRadius: 6,
        justifyContent: 'center',
        
        
      },
      buttonText: {
        fontSize: 20,
        alignSelf: "center"
      },
      
  });
  
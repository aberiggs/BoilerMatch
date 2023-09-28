import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';

export default function Login({navigation}){

    const handleLogin = () => {
        navigation.navigate("MainTabNavigator")
      }

    return(
        <View style={styles.container}>

       
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}> Sign in</Text>
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
        backgroundColor: "gold",
        borderRadius: 6,
        justifyContent: 'center',
        
        
      },
      buttonText: {
        fontSize: 20,
        alignSelf: "center"
      },
      
  });
  
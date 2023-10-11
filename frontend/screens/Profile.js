import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Profile({navigation}){

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token')
        await SecureStore.deleteItemAsync('username')
        navigation.navigate("Landing")
    }


    return(
        <View style={styles.container}>
        <Text> This is your profile page</Text>
        <Pressable style={styles.button} onPress={handleLogout}>

        <Text style={styles.buttonText}> Logout </Text>
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
  });
  
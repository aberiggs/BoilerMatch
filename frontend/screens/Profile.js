import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';

export default function Profile({navigation}){

    const navigateToManageInformation = () => {
      navigation.navigate('ManageInformation')
    }
    
    const navigateToManageHousingInformation = () => {
      navigation.navigate('ManageHousingInformation')
    }

    return(
        <View style={styles.container}>
        <Text> This is your profile page</Text>
        
        <TouchableOpacity style={styles.button} onPress={navigateToManageInformation}>
        <Text style={styles.buttonText}> Manage Information</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={navigateToManageHousingInformation}>
        <Text style={styles.buttonText}> Manage Housing Info</Text>
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
      height: 40,
      backgroundColor: "gold",
      borderRadius: 6,
      justifyContent: 'center',
      margin:10,
    },
    buttonText: {
      fontSize: 15,
      alignSelf: "center"
    },
  });
  
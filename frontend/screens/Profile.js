import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';

export default function Profile({navigation}){


  const navigateToManagePreferences = () => {
    navigation.navigate('ManagePreferences');
  };

  const navigateToManagePreferenceRankings = () => {
    navigation.navigate('ManagePreferenceRankings');
  };

  return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={navigateToManagePreferences}>
        <Text style={styles.buttonText}> Manage Preferences</Text>
        </TouchableOpacity>
        <Text> </Text>

        <TouchableOpacity style={styles.button} onPress={navigateToManagePreferenceRankings}>
        <Text style={styles.buttonText}> Manage Preference Rank</Text>
        </TouchableOpacity>


      <Text> This is your profile page</Text>
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
      
      
    },
    buttonText: {
      fontSize: 15,
      alignSelf: "center"
    },
    
});
  
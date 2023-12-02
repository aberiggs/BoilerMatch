import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import { useEffect, useContext } from 'react';
import themeContext from '../../theme/themeContext';

export default function Getstarted({navigation}){
  const theme = useContext(themeContext)

    const handleFeed = () => {
        navigation.navigate("MainTabNavigator")
    }

    const handleInitialize = () => {
        navigation.navigate("Profile")
    }

    return(
        <View style={[styles.container, {backgroundColor:theme.backgroundColor}]}>
            <View style={{flex: 'column', width: "90%"}}>
                <Text style={[styles.title]}>
                    Let's get you started!
                </Text>

                <Text style={[styles.subtitle]}>
                    Before you start matching with people,
                    you have to initialize all your information in the profile page.
                    Would you like to do it now?
                </Text>
            </View>
        <TouchableOpacity style={styles.button} onPress={handleFeed}>
        <Text style={styles.buttonText}>Skip for now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}onPress={handleInitialize}>
        <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
       </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'left',
        lineHeight: 25,
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 8,
    },
    button: {
        width: "40%",
        height: 50,
        backgroundColor: 'gold',
        borderRadius: 6,
        justifyContent: 'center',
        marginTop: 30
    
    },
    buttonText: {
        fontSize: 20,
        alignSelf: "center"
    },
  });
  
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import axios from "axios"

export default function Settings({navigation}){
  const navigateToUpdateCredentials = () => {
    navigation.navigate('UpdateCredentials')
  }
  
  const navigateToReportFeedback = () => {
    navigation.navigate('ReportFeedback')
  }

    return(
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
            <View style={{flex: 'column', width: "90%", alignItems: 'center'}}>
              <Text style={styles.title}> Settings </Text>
                    <TouchableOpacity style={styles.button} onPress={navigateToUpdateCredentials}>
                    <Text style={styles.buttonText}>Update Credentials</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={navigateToReportFeedback}>
                    <Text style={styles.buttonText}>Submit Request</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
       </View>
    )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scrollView: {
    marginLeft: 30,
    width: '100%',
  },
    otherText: {
      fontSize: 16,
      paddingLeft: 5
    },
    inputFieldBox: {   
      flexDirection: 'row',
      height: 40,
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,        
    },
    inputField: {
      width: "100%",
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 25,
      marginVertical: 14,
    },
    subtitle: {
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 8,
    },
    button: {
      width: "99%",
      height: 50,
      backgroundColor: "gold",
      borderRadius: 6,
      justifyContent: 'center',
      margin:10,
      
    },
    buttonText: {
      fontSize: 15,
      alignSelf: "center",
      textAlign:"center",
    },
    errorMes: {
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingHorizontal: 10,
      marginBottom: 8,
      color: 'red',
      marginHorizontal: 'auto'
    }
  });


import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from "axios"

export default function ReportFeedback({navigation}){
    const reportThroughApi = async () => {
      const username = await SecureStore.getItemAsync('username')
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/reportfeedback', {
        username: username,
        report: report,
      }).catch((error) => {
        if (error.response) {
          return error.response.data
        }
      })

      return response
    }

    const handleReport = async () => {
        const res = await reportThroughApi()

        if (!res || res.success === false) {
          if (res) {
            setErrorMessage(res.message)
          } else {
            setErrorMessage("An unexpected error occurred")
          }
        } else {
          alert('Your report has been submitted!')
          navigation.push('Settings')
        }
    }

    const [report, setReport] = useState('')

    return(
        <View style={styles.container}>
            <View style={{flex: 'column', width: "90%"}}>
            <Text style={styles.title}> Tell us anything! </Text>
                <TextInput 
                  multiline = {true}
                  numberOfLines = {5}
                  placeholder='Provide your feedback/request/issue here'
                  autoCapitalize="none"
                  autoComplete='off'
                  onChangeText={report => setReport(report)}

                  style={styles.inputFieldBox}>
                </TextInput>

                <Pressable style={styles.button} onPress={handleReport}>

                <Text style={styles.buttonText}> Submit </Text>
                </Pressable>
            </View>
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
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "gold",
    borderRadius: 6,
    justifyContent: 'center',
    marginTop: 10,
  },
  inputFieldBox: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: 100,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,        
  },
  scrollView: {
    marginLeft: 30,
    width: '100%',
  },
    otherText: {
      fontSize: 16,
      paddingLeft: 5
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

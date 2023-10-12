import React, { useState } from 'react';
import axios from "axios";
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View,TextInput,TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'

import RNPickerSelect from "react-native-picker-select"




export default function ManagePreferences({navigation}) {

  const [gender, setGender] = useState('');
  const [bedtime, setBedtime] = useState('');
  const [guest, setGuest] = useState('');
  const [clean, setClean] = useState('');
  const [noise, setNoise] = useState('');
  const [errMsgVisible, setErrMsgVisible] = useState(false);
  const [submitMsgVisible, setSubmitMsgVisible] = useState(false);

  const handleSubmit = async () => {
    if (!gender || !bedtime || !guest || !clean || !noise ){
      setErrMsgVisible(true);
    } else {
      //TODO: Error checking
      const res = await updatePreferencesThroughApi();
      setSubmitMsgVisible(true);
    }
  }

  const navigateToProfile = () => {
    navigation.goBack()
  }

  const updatePreferencesThroughApi = async() => {
    const tokenVal = await SecureStore.getItemAsync('token')
    const response  = await axios.post('http://localhost:3000/api/user/preferences/update', {
      token: tokenVal,
      gender: gender,
      bedtime: bedtime,
      guest: guest,
      clean: clean,
      noise: noise
    }).catch((error) => {
      if (error.response) {
        return error.response.data
      }
      return
    })
    return response
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <Text style={styles.subtitle}>Select the preferred gender of your roommate</Text>
       <RNPickerSelect
          placeholder={ {label: "Select gender.", value: null}}
          onValueChange={(value) => setGender(value)}
          items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other/No preference", value: "other" }
          ]}
          style={pickerSelectStyles}
        />
        <Text style={styles.subtitle}>Select your preferred bedtime:</Text>
        <RNPickerSelect
          placeholder={ {label: "Select bedtime: ", value: null}}
          onValueChange={(value) => setBedtime(value)}
          items={[
              { label: "Before 9PM", value: "9" },
              { label: "9PM-10PM", value: "10" },
              { label: "10PM-11PM", value: "11" },
              { label: "11PM-12PM", value: "12" },
              { label: "12PM-1AM", value: "1" },
              { label: "1AM+", value: "2" }
          ]}
          style={pickerSelectStyles}
        />
        <Text style={styles.subtitle}>How comfortable are you with guests:</Text>
        <RNPickerSelect
          placeholder={ {label: "Select:", value: null}}
          onValueChange={(value) => setGuest(value)}
          items={[
              { label: "Never", value: "never" },
              { label: "Weekends only", value: "weekend" },
              { label: "Most of the time (weekends, some weekdays)", value: "sometimes" },
              { label : "Anytime!", value: "anytime"}
          ]}
          style={pickerSelectStyles}
        />
        <Text style={styles.subtitle}>On a scale of 1-5, how clean do you prefer your environment:</Text>
        <RNPickerSelect
          placeholder={ {label: "Select cleanliness.", value: null}}
          onValueChange={(value) => setClean(value)}
          items={[
              { label: "5: Spotless, very organized.", value: "5" },
              { label: "4: Clean, but doesn't have to be perfect", value: "4" },
              { label: "3: Not clean, but not filthy", value: "3" },
              { label: "2: Not so clean", value: "2"},
              { label: "1: Dumpster", value: "1"}
          ]}
          style={pickerSelectStyles}
        />
         <Text style={styles.subtitle}>What's your preferred noise level?</Text>
        <RNPickerSelect
          placeholder={ {label: "Select noise level:", value: null}}
          onValueChange={(value) => setNoise(value)}
          items={[
              { label: "5: Be as loud as you want.", value: "5" },
              { label: "4: We can be loud on the weekends", value: "4" },
              { label: "3: A good balance of loud and quiet", value: "3" },
              { label: "2: I prefer it to be quiet more often", value: "2"},
              { label: "1: Library, 24/7.", value: "1"}
          ]}
          style={pickerSelectStyles}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Preferences</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={navigateToProfile}>
        <Text style={styles.buttonText}>Go Back to Profile</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={errMsgVisible}
          onRequestClose={() => {
            setErrMsgVisible(!errMsgVisible);
          }}
        >
           <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please make sure all the fields are filled out.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setErrMsgVisible(!errMsgVisible)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={submitMsgVisible}
          onRequestClose={() => {
            setSubmitMsgVisible(!submitMsgVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Your information has been saved.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setSubmitMsgVisible(!submitMsgVisible);
                navigateToProfile();
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </Modal>

        </ScrollView>
    </View>

    
  );
}




const styles = StyleSheet.create({
  buttonText: {
    fontSize: 15,
    alignSelf: "center"
  },
  button: {
    width: "40%",
    height: 40,
    backgroundColor: "gold",
    borderRadius: 6,
    justifyContent: 'center',
    margin: 10,   
    
  },
  modalView: {
    flex:1,
    marginTop:50,
    padding:20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: 'gold',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 8
  },
  
  scrollView: {
    marginVertical:50,
    marginHorizontal:15,
  }
  
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    marginBottom: 20,
  }
}
);

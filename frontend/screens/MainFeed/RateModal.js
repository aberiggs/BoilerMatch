import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View,TextInput,TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'
import themeContext from '../../theme/themeContext';

import RNPickerSelect from "react-native-picker-select"




export default function ManageRatings({visible, user, onClose}) {

  const [bedtime, setBedtime] = useState('');
  const [guest, setGuest] = useState('');
  const [clean, setClean] = useState('');
  const [noise, setNoise] = useState('');
  const [errMsgVisible, setErrMsgVisible] = useState(false);
  const [submitMsgVisible, setSubmitMsgVisible] = useState(false);
  const theme = useContext(themeContext)


  const handleSubmit = async () => {
    if (!bedtime || !guest || !clean || !noise ){
      setErrMsgVisible(true);
    } else {
      //TODO: Error checking
      const res = await updateRatingsThroughApi();
      closeRateModal();
    }
  }


  const closeRateModal = () => {
    onClose();
  };

  const updateRatingsThroughApi = async() => {
    const tokenVal = await SecureStore.getItemAsync('token')
    console.log("RATING!")
    const response  = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/rate', {
      token: tokenVal,
      bedtime: bedtime,
      guest: guest,
      clean: clean,
      noise: noise,
      username: user
    }).catch((error) => {
      if (error.response) {
        return error.response.data
      }
      return
    })
    return response
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      
    >
        <View style={[styles.modalView]}>
        <ScrollView style={styles.scrollView}>
        <Text style={[styles.subtitle, {color:theme.color}]}>What time does this person usually go to bed:</Text>
        <RNPickerSelect
          placeholder={ {label: "Select bedtime: ", value: null}}
          onValueChange={(value) => setBedtime(value)}
          value={bedtime}
          items={[
              { label: "Before 9PM", value: "< 9" },
              { label: "9PM-10PM", value: "9-10" },
              { label: "10PM-11PM", value: "10-11" },
              { label: "11PM-12PM", value: "11-12" },
              { label: "12PM-1AM", value: "12-1" },
              { label: "1AM+", value: "1+" }
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        />
        <Text style={[styles.subtitle, {color:theme.color}]}>How often does this person have guests over:</Text>
        <RNPickerSelect
          placeholder={ {label: "Select:", value: null}}
          onValueChange={(value) => setGuest(value)}
          value={guest}
          items={[
              { label: "Never", value: "never" },
              { label: "Weekends only", value: "Weekends only" },
              { label: "Most of the time (weekends, some weekdays)", value: "Fairly often" },
              { label : "All the time", value: "All the time"}
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        />
        <Text style={[styles.subtitle, {color:theme.color}]}>On a scale of 1-5, how clean was this person:</Text>
        <RNPickerSelect
          placeholder={ {label: "Select cleanliness.", value: null}}
          onValueChange={(value) => setClean(value)}
          value={clean}
          items={[
              { label: "5: Spotless, very organized.", value: "Spotless" },
              { label: "4: Clean, but doesn't have to be perfect", value: "Clean" },
              { label: "3: Not clean, but not filthy", value: "In the middle" },
              { label: "2: Not so clean", value: "Not so clean"},
              { label: "1: Dumpster", value: "Dirty"}
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        />
         <Text style={[styles.subtitle, {color:theme.color}]}>How loud was this person?</Text>
        <RNPickerSelect
          placeholder={ {label: "Select noise level:", value: null}}
          onValueChange={(value) => setNoise(value)}
          value={noise}
          items={[
              { label: "5: LOUD", value: "LOUD" },
              { label: "4: Ocassionally loud", value: "Ocassionally loud" },
              { label: "3: A good balance of loud and quiet", value: "A good balance" },
              { label: "2: Quiet more often", value: "Quiet"},
              { label: "1: Library, 24/7.", value: "Silent"}
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit ratings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={closeRateModal}>
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
    </Modal>

    
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
    alignSelf: 'center',
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

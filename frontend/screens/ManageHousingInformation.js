import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View,TextInput,TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'

import RNPickerSelect from "react-native-picker-select"

export default function ManageHousingInformation({navigation}) {

  const [housing, setHousing] = useState('');
  const [confirmedHousingSituation, setConfirmedHousingSituation] = useState('');
  const [numRoommates, setNumRoommates] = useState('');
  const [unknownHousingSituation, setUnknownHousingSituation] = useState('');

  const [errMsgVisible, setErrMsgVisible] = useState(false);
  const [invalidEntriesMsgVisibile, setInvalidEntriesMsgVisible] = useState(false);
  const [submitMsgVisible, setSubmitMsgVisible] = useState(false);

  useEffect(() => {
    setupInitialHousingInfo()
  }, [])

  const setupInitialHousingInfo = async() => {
    const resData = await getInitialHousingInfo()
    // No data or success is false
    if (!resData || !resData.success) {
      return
    }

    setHousing(resData.housingInformation.housing)
    setConfirmedHousingSituation(resData.housingInformation.confirmedHousingSituation)
    setNumRoommates(resData.housingInformation.numRoommates)
    setUnknownHousingSituation(resData.housingInformation.unknownHousingSituation)
  }

  const getInitialHousingInfo = async() => {
    const tokenVal = await SecureStore.getItemAsync('token')
    const response  = await axios.post('http://localhost:3000/api/user/housingInformation', {
      token: tokenVal,
    }).catch((error) => {
      if (error.response) {
        return error.response.data
      }
      return
    })
    return response.data
  }

  const handleSubmit = async () => {
    // If not all the fields filled out then send error message
    if ( !housing || !confirmedHousingSituation || !numRoommates || !unknownHousingSituation) {
      setErrMsgVisible(true);
    } else if ( housing == "yes" && (confirmedHousingSituation == "na" || numRoommates == "na" || unknownHousingSituation != "na")){
      setInvalidEntriesMsgVisible(true);
    } else if ( housing == "no" && (confirmedHousingSituation != "na" || numRoommates != "na" || unknownHousingSituation == "na")){
      setInvalidEntriesMsgVisible(true)
    } else {
      //TODO: Error checking
      const res = updateInformationThroughApi();
      setSubmitMsgVisible(true);
    }
  }

  const updateInformationThroughApi = async() => {
    const housingInformation = {
      housing: housing,
      confirmedHousingSituation: confirmedHousingSituation,
      numRoommates: numRoommates,
      unknownHousingSituation: unknownHousingSituation,
    }
    // port is 3000, numbers before that is my IP address
    const tokenVal = await SecureStore.getItemAsync('token')
    const response = await axios.post('http://localhost:3000/api/user/housingInformation/update', {
      token: tokenVal,
      housingInformation: housingInformation
    }).catch((error) => {
      if (error.response) {
        return error.response.data
      }
      return
    })
    return response
  }

  const navigateToProfile = () => {
    navigation.goBack()
  }
  
  return (
    
    <View style={styles.container}>

      <ScrollView style={styles.scrollView}>

        <Text style={styles.title}>Please fill out your housing information in the following fields</Text>

        <Text style={styles.subtitle}>Do you already have housing and are only looking for a roommmate?</Text>

        <RNPickerSelect
          placeholder={ {label: "Select yes/no", value: null}}
          onValueChange={(value) => setHousing(value)}
          value={housing}
          items={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
          ]}
          style={pickerSelectStyles}
        />

        <Text style={styles.subtitle}>If you have housing, what is your housing situation?</Text>

        <RNPickerSelect
          placeholder={ {label: "Select housing situation", value: null}}
          onValueChange={(value) => setConfirmedHousingSituation(value)}
          value={confirmedHousingSituation}
          items={[
              { label: "Dorms", value: "dorms" },
              { label: "Apartments - On Campus", value: "apartmentCampus" },
              { label: "Apartments - Not on Campus", value: "apartmentNotCampus" },
              { label: "House - On Campus", value: "houseCampus" },
              { label: "House - Not on Campus", value: "houseNotCampus" },
              { label: "Townhouse - On Campus", value: "townhouseCampus" },
              { label: "Townhouse - Not on Campus", value: "townhouseNotCampus" },
              { label: "Other", value: "other"},
              { label: "N/A: Don't have housing yet", value: "na"},
          ]}
          style={pickerSelectStyles}
        />

        <Text style={styles.subtitle}>If you have housing, how many roommmates are you looking for?</Text>

        <RNPickerSelect
          placeholder={ {label: "Select number of roommates", value: null}}
          onValueChange={(value) => setNumRoommates(value)}
          value={numRoommates}
          items={[
              { label: "1", value: "1" },
              { label: "2", value: "2" },
              { label: "3", value: "3" },
              { label: "4", value: "4" },
              { label: "5", value: "5" },
              { label: "N/A: Don't have housing yet", value: "na"}
          ]}
          style={pickerSelectStyles}
        />

        <Text style={styles.subtitle}>If you don't have housing, what housing situation are you looking for?</Text>

        <RNPickerSelect
          placeholder={ {label: "Select preference for housing situation", value: null}}
          onValueChange={(value) => setUnknownHousingSituation(value)}
          value={unknownHousingSituation}
          items={[
              { label: "Dorms", value: "dorms" },
              { label: "Apartments - On Campus", value: "apartmentCampus" },
              { label: "Apartments - Not on Campus", value: "apartmentNotCampus" },
              { label: "House - On Campus", value: "houseCampus" },
              { label: "House - Not on Campus", value: "houseNotCampus" },
              { label: "Townhouse - On Campus", value: "townhouseCampus" },
              { label: "Townhouse - Not on Campus", value: "townhouseNotCampus" },
              { label: "Anything on Campus", value: "onCampus"},
              { label: "Anything not on Campus", value: "notOnCampus"},
              { label: "Other", value: "other"},
              { label: "N/A: Already have housing", value: "na"}
          ]}
          style={pickerSelectStyles}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Information</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={navigateToProfile}>
        <Text style={styles.buttonText}>Go Back to Profile</Text>
        </TouchableOpacity>

        {/* Modal for error message */}
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

        {/* Modal for invalid fields message */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={invalidEntriesMsgVisibile}
          onRequestClose={() => {
            setInvalidEntriesMsgVisible(!invalidEntriesMsgVisibile);
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please make sure that the fields are filled out correctly. There are currently some conflicting answers to the fields.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setInvalidEntriesMsgVisible(!invalidEntriesMsgVisibile)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </Modal>

        {/* Modal for submit message */}
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
  );;
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
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 30,
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    marginBottom: 20,
  }
}

);
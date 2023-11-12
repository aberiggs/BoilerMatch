import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View,TextInput,TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import * as SecureStore from 'expo-secure-store'
import axios from 'axios';
import themeContext from '../../theme/themeContext';

import RNPickerSelect from "react-native-picker-select"

export default function ManageInformation({navigation}) {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [yearForRoommate, setYearForRoommate] = useState('');
  const [gender, setGender] = useState('');
  const [graduation, setGraduation] = useState('');
  const [major, setMajor] = useState('');
  const [race, setRace] = useState('');
  const [pets, setPets] = useState('');
  const [religion, setReligion] = useState('');
  const [politicalViews, setPoliticalViews] = useState('')
  const [sleepingHabits, setSleepingHabits] = useState('');
  const [drinkingHabits, setDrinkingHabits] = useState('');
  const [errMsgVisible, setErrMsgVisible] = useState(false);
  const [submitMsgVisible, setSubmitMsgVisible] = useState(false);
  const theme = useContext(themeContext)

  useEffect(() => {
    setupInitialInfo()
  }, [])

  const setupInitialInfo = async() => {
    const resData = await getInitialInfo()
    // No data or success is false
    if (!resData || !resData.success) {
      return
    }

    setFirstName(resData.information.firstName)
    setLastName(resData.information.lastName)
    setYearForRoommate(resData.information.yearForRoommate)
    setGender(resData.information.gender)
    setGraduation(resData.information.graduation)
    setMajor(resData.information.major)
    setRace(resData.information.race)
    setPets(resData.information.pets)
    setReligion(resData.information.religion)
    setPoliticalViews(resData.information.politicalViews)
    setSleepingHabits(resData.information.sleepingHabits)
    setDrinkingHabits(resData.information.drinkingHabits)
  }

  const getInitialInfo = async() => {
    const tokenVal = await SecureStore.getItemAsync('token')
    const response  = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/information', {
      token: tokenVal,
    }).catch((error) => {
      if (error.response) {
        return error.response.data
      }
      return
    })

    return response.data
  }

  const handleFirstNameChange = (text) => {
    setFirstName(text);
  };
  const handleLastNameChange = (text) => {
    setLastName(text);
  };
  const handleMajorChange = (text) => {
    setMajor(text);
  };

  const badWords = ["fuck", "shit", "slut", "whore", "cunt", "bitch", "dick", "sprocket"]

  const checkBad = () => {
    const first = firstName.toLowerCase()
    const last = lastName.toLowerCase()
    
    for (let i = 0; i < badWords.length; i++) {
      if (first.includes(badWords[i]) || last.includes(badWords[i])) {
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    // If not all the fields filled out then send error message
    if ( !firstName || !lastName || !yearForRoommate || !gender || !graduation || !major || !race ||
      !pets || !religion || !politicalViews || !sleepingHabits || !drinkingHabits) {
      setErrMsgVisible(true);
    } else if (!checkBad()) {
      alert("Make sure your names are appropriate!")
    } else {
      const res = updateInformationThroughApi();
      // TODO: Error checking
      setSubmitMsgVisible(true);
    }
  }

  const updateInformationThroughApi = async() => {
    const information = {
      firstName: firstName,
      lastName: lastName,
      yearForRoommate: yearForRoommate,
      gender: gender,
      graduation: graduation,
      major: major,
      race: race,
      pets: pets,
      religion: religion,
      politicalViews: politicalViews,
      sleepingHabits: sleepingHabits,
      drinkingHabits: drinkingHabits,
    }
    // port is 3000, numbers before that is my IP address
    const tokenVal = await SecureStore.getItemAsync('token')
    const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/information/update', {
      token: tokenVal,
      information: information
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
    
    <View style={[styles.container, {backgroundColor:theme.backgroundColor}]}>

      <ScrollView style={styles.scrollView}>

        <Text style={[styles.title,{color:theme.color}]}>Please fill out your information in the following fields</Text>

        <Text style={[styles.subtitle, {color:theme.color}]}>First Name</Text> 

        <TextInput
          style={[styles.input, {color:theme.color}]}
          placeholder="First Name"
          value={firstName}
          onChangeText={handleFirstNameChange}
        />

        <Text style={[styles.subtitle, {color:theme.color}]}>Last Name</Text> 

        <TextInput
          style={[styles.input, {color:theme.color}]}
          placeholder="Last Name"
          value={lastName}
          onChangeText={handleLastNameChange}
        />

        <Text style={[styles.subtitle, {color:theme.color}]}>For what year are you looking for a roommate?</Text>

        <RNPickerSelect
          placeholder={ {label: "Select a semester", value: null}}
          onValueChange={(value) => setYearForRoommate(value)}
          value={yearForRoommate}
          items={[
              { label: "Fall 2024", value: "fall24" },
              { label: "Spring 2025", value: "spring25" },
              { label: "Fall 2025", value: "fall25" },
              { label: "Spring 2026", value: "spring26" },
              { label: "Fall 2026", value: "fall26" },
              { label: "Spring 2027", value: "spring27" },
              { label: "Fall 2027", value: "fall27" },
              { label: "Spring 2028", value: "spring28" },
              { label: "Fall 2028", value: "fall28" },
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        />

        <Text style={[styles.subtitle, {color:theme.color}]}>Gender</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your gender", value: null}}
          onValueChange={(value) => setGender(value)}
          value={gender}
          items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        /> 

        <Text style={[styles.subtitle, {color:theme.color}]}>Select Date of Graduation</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your date of graduation", value: null}}
          onValueChange={(value) => setGraduation(value)}
          value={graduation}
          items={[
              { label: "Fall 2024", value: "fall24" },
              { label: "Spring 2025", value: "spring25" },
              { label: "Fall 2025", value: "fall25" },
              { label: "Spring 2026", value: "spring26" },
              { label: "Fall 2026", value: "fall26" },
              { label: "Spring 2027", value: "spring27" },
              { label: "Fall 2027", value: "fall27" },
              { label: "Spring 2028", value: "spring28" },
              { label: "Fall 2028", value: "fall28" },
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        /> 

        <Text style={[styles.subtitle, {color:theme.color}]}>Major</Text> 

        <TextInput
          style={[styles.input, {color:theme.color}]}
          placeholder="Major"
          value={major}
          onChangeText={handleMajorChange}
        />

        <Text style={[styles.subtitle, {color:theme.color}]}>Select Race</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your race", value: null}}
          onValueChange={(value) => setRace(value)}
          value={race}
          items={[
              { label: "American Indian or Alaskan Native", value: "indian" },
              { label: "Asian", value: "asian" },
              { label: "Black or African Descent", value: "black" },
              { label: "Hispanic or Latino", value: "hispanic" },
              { label: "Native Hawaiian or Pacific Islander", value: "islander" },
              { label: "White", value: "white" },
              { label: "Other", value: "other" },
              { label: "Prefer not to say", value: "preferNotToSay" },
              { label: "Two or more races", value: "twoOrMore" },
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        /> 

        <Text style={[styles.subtitle, {color:theme.color}]}>Select Pets</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your pets", value: null}}
          onValueChange={(value) => setPets(value)}
          value={pets}
          items={[
              { label: "Dog", value: "dog" },
              { label: "Cat", value: "cat" },
              { label: "Reptile", value: "reptile" },
              { label: "Amphibian", value: "amphibian" },
              { label: "Bird", value: "bird" },
              { label: "Fish", value: "fish" },
              { label: "Hamster", value: "hamster" },
              { label: "Rabbit", value: "rabbit" },
              { label: "Other", value: "other" },
              { label: "Pet-free", value: "pet-free" },
              { label: "Allergic to pets", value: "allergic" },
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        /> 

        <Text style={[styles.subtitle, {color:theme.color}]}>Select Religion</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your religion", value: null}}
          onValueChange={(value) => setReligion(value)}
          value={religion}
          items={[
              { label: "Agnostic", value: "agnostic" },
              { label: "Atheist", value: "atheist" },
              { label: "Buddhist", value: "buddhist" },
              { label: "Catholic", value: "catholic" },
              { label: "Christian", value: "christian" },
              { label: "Hindu", value: "hindu" },
              { label: "Jewish", value: "jewish" },
              { label: "Muslim", value: "muslim" },
              { label: "Sikh", value: "sikh" },
              { label: "Spiritual", value: "spiritual" },
              { label: "Other", value: "other" },
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        /> 

        <Text style={[styles.subtitle, {color:theme.color}]}>Select Political Views</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your political views", value: null}}
          onValueChange={(value) => setPoliticalViews(value)}
          value={politicalViews}
          items={[
              { label: "Conservative", value: "conservative" },
              { label: "Liberal", value: "liberal" },
              { label: "Moderate", value: "moderate" },
              { label: "Not Political", value: "not political" },
              { label: "Other", value: "other" },
              { label: "Prefer not to say", value: "preferNotToSay" },
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        /> 

        <Text style={[styles.subtitle, {color:theme.color}]}>Select Sleeping Habits</Text>

        <RNPickerSelect
          placeholder={ {label: "Selects your sleeping habits", value: null}}
          onValueChange={(value) => setSleepingHabits(value)}
          value={sleepingHabits}
          items={[
              { label: "Early bird", value: "earlyBird" },
              { label: "Night owl", value: "nightOwl" },
              { label: "In a spectrum", value: "inSpectrum" },
          ]}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: theme.color
            }
          }}
        />

        <Text style={[styles.subtitle, {color:theme.color}]}>Select Drinking Habits</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your drinking habits", value: null}}
          onValueChange={(value) => setDrinkingHabits(value)}
          value={drinkingHabits}
          items={[
              { label: "Not for me", value: "notForMe" },
              { label: "Sober", value: "sober" },
              { label: "On special occasions", value: "specialOccasion" },
              { label: "Socially on weekends", value: "sociallyWeekends" },
              { label: "Most nights", value: "mostNights" },
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
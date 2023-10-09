import React, { useState } from 'react';

import { StyleSheet, Text, View,TextInput,TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';

import RNPickerSelect from "react-native-picker-select"

export default function ManageInformation(navigation) {

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

  const handleFirstNameChange = (text) => {
    setFirstName(text);
  };
  const handleLastNameChange = (text) => {
    setLastName(text);
  };
  const handleMajorChange = (text) => {
    setMajor(text);
  };

  const handleSubmit = () => {
    if (firstName === '' || lastName === '') {
      setErrMsgVisible(true);
      console.log("FALSEEEEEE")
    } else {
      console.log("Submit pressed");
      console.log(firstName, lastName, yearForRoommate, gender, graduation)
    }
  }

  // const navigateToProfile = () => {
  //   navigation.navigate('Login')
  // }
  
  return (
    <View style={styles.container}>

      <ScrollView style={styles.scrollView}>

        <Text style={styles.title}>Please fill out your information in the following fields</Text>

        <Text style={styles.subtitle}>First Name</Text> 

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={handleFirstNameChange}
        />

        <Text style={styles.subtitle}>Last Name</Text> 

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={handleLastNameChange}
        />

        <Text style={styles.subtitle}>For what year are you looking for a roommate?</Text>

        <RNPickerSelect
          placeholder={ {label: "Select a semester", value: null}}
          onValueChange={(value) => setYearForRoommate(value)}
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
          style={pickerSelectStyles}
        />

        <Text style={styles.subtitle}>Gender</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your gender", value: null}}
          onValueChange={(value) => setGender(value)}
          items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
          ]}
          style={pickerSelectStyles}
        /> 

        <Text style={styles.subtitle}>Select Date of Graduation</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your date of graduation", value: null}}
          onValueChange={(value) => setGraduation(value)}
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
          style={pickerSelectStyles}
        /> 

        <Text style={styles.subtitle}>Major</Text> 

        <TextInput
          style={styles.input}
          placeholder="Major"
          value={major}
          onChangeText={handleMajorChange}
        />

        <Text style={styles.subtitle}>Select Race</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your race", value: null}}
          onValueChange={(value) => setRace(value)}
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
          style={pickerSelectStyles}
        /> 

        <Text style={styles.subtitle}>Select Pets</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your pets", value: null}}
          onValueChange={(value) => setPets(value)}
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
          style={pickerSelectStyles}
        /> 

        <Text style={styles.subtitle}>Select Religion</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your religion", value: null}}
          onValueChange={(value) => setReligion(value)}
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
          style={pickerSelectStyles}
        /> 

        <Text style={styles.subtitle}>Select Political Views</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your political views", value: null}}
          onValueChange={(value) => setPoliticalViews(value)}
          items={[
              { label: "Conservative", value: "conservative" },
              { label: "Liberal", value: "liberal" },
              { label: "Moderate", value: "moderate" },
              { label: "Not Political", value: "not political" },
              { label: "Other", value: "other" },
              { label: "Prefer not to say", value: "preferNotToSay" },
          ]}
          style={pickerSelectStyles}
        /> 

        <Text style={styles.subtitle}>Select Sleeping Habits</Text>

        <RNPickerSelect
          placeholder={ {label: "Selects your sleeping habits", value: null}}
          onValueChange={(value) => setSleepingHabits(value)}
          items={[
              { label: "Early bird", value: "earlyBird" },
              { label: "Night owl", value: "nightOwl" },
              { label: "In a spectrum", value: "inSpectrum" },
          ]}
          style={pickerSelectStyles}
        />

        <Text style={styles.subtitle}>Select Drinking Habits</Text>

        <RNPickerSelect
          placeholder={ {label: "Select your drinking habits", value: null}}
          onValueChange={(value) => setDrinkingHabits(value)}
          items={[
              { label: "Not for me", value: "notForMe" },
              { label: "Sober", value: "sober" },
              { label: "On special occasions", value: "specialOccasion" },
              { label: "Socially on weekends", value: "sociallyWeekends" },
              { label: "Most nights", value: "mostNights" },
          ]}
          style={pickerSelectStyles}
        /> 

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Information</Text>
        </TouchableOpacity>

        {/* Modal */}
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

        {/* <TouchableOpacity style={styles.button} onPress={navigateToProfile}>
        <Text style={styles.buttonText}> Go Back to Profile Screen </Text>
        </TouchableOpacity> */}

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
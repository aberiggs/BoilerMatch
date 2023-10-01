import React, { useState } from 'react';

import { StyleSheet, Text, View,TextInput,TouchableOpacity } from 'react-native';

import RNPickerSelect from "react-native-picker-select"

export default function ManageInformation() {

  const [gender, setGender] = useState('');
  const handleGenderChange = (text) => {
    setGender(text);
  };
  const handleSubmit = () => {
    console.log("Submit pressed");
  }
  
  
  return (
    <View style={styles.container}>
      <Text>Please fill out your information in the following fields</Text>

      <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
        ]}
      />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Information</Text>
        </TouchableOpacity>
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
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  }
});
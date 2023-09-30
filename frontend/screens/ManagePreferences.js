//import React from 'react';
import React, { useState } from 'react';

import { StyleSheet, Text, View,TextInput,TouchableOpacity } from 'react-native';


export default function ManagePreferences() {

  const [name, setName] = useState('');
  const handleNameChange = (text) => {
    setName(text);
  };
  const handleSubmit = () => {
    console.log("Submit pressed");
  }


  return (
    <View style={styles.container}>
      <Text>Please fill out your preferences in the following fields</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={handleNameChange}
      />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Preferences</Text>
        </TouchableOpacity>
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
  },
});

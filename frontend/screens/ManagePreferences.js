//import React from 'react';
import React, { useState } from 'react';
import RNPickerSelect from "react-native-picker-select"
import { StyleSheet, Text, View,TextInput,TouchableOpacity } from 'react-native';




export default function ManagePreferences() {

  const [name, setName] = useState('');

  const handleSubmit = () => {
    updatePreferencesThroughApi();
  }

  const updatePreferencesThroughApi = async() => {
    const response  = await axios.post('http://localhost:3000/api/user/preferences', {
      name: name
    })
    return response;
  }

  return (
    <View style={styles.container}>
       <RNPickerSelect
          placeholder={ {label: "Select the preferred gender of your roommate", value: null}}
          onValueChange={(value) => console.log(value)}
          items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other/No preference", value: "other" }
          ]}
          style={pickerSelectStyles}
        />
        <RNPickerSelect
          placeholder={ {label: "Select your preferred bedtime:", value: null}}
          onValueChange={(value) => console.log(value)}
          items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other/No preference", value: "other" }
          ]}
          style={pickerSelectStyles}
        />
        <RNPickerSelect
          placeholder={ {label: "How comfortable are you with guests", value: null}}
          onValueChange={(value) => console.log(value)}
          items={[
              { label: "Never", value: "never" },
              { label: "Weekends only", value: "weekend" },
              { label: "Most of the time (weekends, some weekdays)", value: "sometimes" },
              { label : "Anytime!", value: "anyimte"}
          ]}
          style={pickerSelectStyles}
        />
        <RNPickerSelect
          placeholder={ {label: "On a scale of 1-5, how clean do you prefer your environment", value: null}}
          onValueChange={(value) => console.log(value)}
          items={[
              { label: "5: Spotless, very organized.", value: "5" },
              { label: "4: Clean, but doesn't have to be perfect", value: "4" },
              { label: "3: Not clean, but not filthy", value: "3" },
              { label: "2: Not so clean", value: "2"},
              { label: "1: Dumpster", value: "1"}
          ]}
          style={pickerSelectStyles}
        />
        <RNPickerSelect
          placeholder={ {label: "What's your preferred noise level", value: null}}
          onValueChange={(value) => console.log(value)}
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

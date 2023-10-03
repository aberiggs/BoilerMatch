import React, { useState } from 'react';

import { StyleSheet, Text, View,TextInput,TouchableOpacity, ScrollView } from 'react-native';

import RNPickerSelect from "react-native-picker-select"



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
      <ScrollView style={styles.scrollView}></ScrollView>
      <Text style={styles.subtitle}>Select the preferred gender of your roommate</Text>
       <RNPickerSelect
          placeholder={ {label: "Select gender.", value: null}}
          onValueChange={(value) => console.log(value)}
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
          onValueChange={(value) => console.log(value)}
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
          onValueChange={(value) => console.log(value)}
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
         <Text style={styles.subtitle}>What's your preferred noise level?</Text>
        <RNPickerSelect
          placeholder={ {label: "Select noise level:", value: null}}
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

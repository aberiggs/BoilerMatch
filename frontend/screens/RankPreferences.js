import React, { useState } from 'react';
import axios from "axios";
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View,TextInput,TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import RNPickerSelect from "react-native-picker-select"




export default function ManagePreferenceRankings({navigation}) {

  const [rank1, setRank1] = useState('');
  const [rank2, setRank2] = useState('');
  const [rank3, setRank3] = useState('');
  const [rank4, setRank4] = useState('');
  const [rank5, setRank5] = useState('');


  const [errMsgVisible, setErrMsgVisible] = useState(false);
  const [submitMsgVisible, setSubmitMsgVisible] = useState(false);

  const handleSubmit = () => {
    if (!rank1 || !rank2 || !rank3 || !rank4 || !rank5 ){
      setErrMsgVisible(true);
    }
    else if(rank1 == rank2 || rank1 == rank3 || rank1 == rank4 || rank1 == rank5
            || rank2 == rank3 || rank2 == rank4 || rank2 == rank5
            || rank3 == rank4 || rank3 == rank5|| rank4 == rank5) {
        setErrMsgVisible(true);
        console.log("Cannot specify same preference for same rank")
    } else {
        updateRankingsThroughApi();
      setSubmitMsgVisible(true);
    }
  }

  const navigateToProfile = () => {
    navigation.goBack()
  }

  const updateRankingsThroughApi = async() => {
    const response  = await axios.post('http://192.168.101.160:3000/api/user/preferencerank', {
      rank1: rank1,
      rank2: rank2,
      rank3: rank3,
      rank4: rank4,
      rank5: rank5
    })


    if (response.status === 200) {
      // API call was successful
      console.log('API Response:', response.data);
      return response.data; // You can return the data to the caller if needed
    } else {
      // Handle other response status codes here
      console.error('API Error:', response.status);
    }

    return response
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <Text style={styles.subtitle}>Rank your preferences in order of importance to you! Do not select the same preference for different ranks.</Text>
       <RNPickerSelect
          placeholder={ {label: "#1 Most important:", value: null}}
          onValueChange={(value) => setRank1(value)}
          items={[
              { label: "Gender of roommate", value: "gender" },
              { label: "Bedtime", value: "bedtime" },
              { label: "Guest comfort", value: "guest" },
              { label: "Cleanliness", value: "clean" },
              { label: "Noise level", value: "noise" }
          ]}
          style={pickerSelectStyles}
        />
        <RNPickerSelect
          placeholder={ {label: "#2:", value: null}}
          onValueChange={(value) => setRank2(value)}
          items={[
              { label: "Gender of roommate", value: "gender" },
              { label: "Bedtime", value: "bedtime" },
              { label: "Guest comfort", value: "guest" },
              { label: "Cleanliness", value: "clean" },
              { label: "Noise level", value: "noise" }
          ]}
          style={pickerSelectStyles}
        />
        <RNPickerSelect
          placeholder={ {label: "#3:", value: null}}
          onValueChange={(value) => setRank3(value)}
          items={[
              { label: "Gender of roommate", value: "gender" },
              { label: "Bedtime", value: "bedtime" },
              { label: "Guest comfort", value: "guest" },
              { label: "Cleanliness", value: "clean" },
              { label: "Noise level", value: "noise" }
          ]}
          style={pickerSelectStyles}
        />
        <RNPickerSelect
          placeholder={ {label: "#4:", value: null}}
          onValueChange={(value) => setRank4(value)}
          items={[
              { label: "Gender of roommate", value: "gender" },
              { label: "Bedtime", value: "bedtime" },
              { label: "Guest comfort", value: "guest" },
              { label: "Cleanliness", value: "clean" },
              { label: "Noise level", value: "noise" }
          ]}
          style={pickerSelectStyles}
        />
        <RNPickerSelect
          placeholder={ {label: "#5:", value: null}}
          onValueChange={(value) => setRank5(value)}
          items={[
              { label: "Gender of roommate", value: "gender" },
              { label: "Bedtime", value: "bedtime" },
              { label: "Guest comfort", value: "guest" },
              { label: "Cleanliness", value: "clean" },
              { label: "Noise level", value: "noise" }
          ]}
          style={pickerSelectStyles}
        />
        

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Rankings</Text>
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
              Please make sure all the fields are filled out and no two fields are the same.
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
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, TextInput} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from "react-native-picker-select"
import * as SecureStore from 'expo-secure-store'
import axios from "axios"

export default function ReportBlockModal({ visible, onClose , onCloseConversation, otherUsername}) {
  
  const [report, setReport] = useState('');
  const [reportReasonCategory, setReportReasonCategory] = useState('');
  const [reportReasonWritten, setReportReasonWritten] = useState('');
  const [block, setBlock] = useState('');
  const [errMsgVisible, setErrMsgVisible] = useState(false);
  const [submitMsgVisibleReport, setSubmitMsgVisibleReport] = useState(false);
  const [submitMsgVisibleBlock, setSubmitMsgVisibleBlock] = useState(false);
  const [invalidEntriesMsgVisible, setInvalidEntriesMsgVisible] = useState(false);

  const handleReportReasonWritten = (text) => {
    setReportReasonWritten(text);
  };

  const handleSubmit = async () => {
    // If not all the fields filled out then send error message
    // If not all the fields filled out then send error message
    if ( !report || !reportReasonCategory || !reportReasonWritten  || !block) {
      setErrMsgVisible(true);
    } else if ( report == "yes" && reportReasonCategory == "na"){
      setInvalidEntriesMsgVisible(true);
    } else if ( report == "no" && block == "yes" && reportReasonCategory != "na"){
      setInvalidEntriesMsgVisible(true)
    } else if (block == "yes"){
      // const res = updateInformationThroughApi();
      // TODO: Error checking
      const res = blockThroughApi();
      setSubmitMsgVisibleBlock(true);
    } else if (report == "yes") {
      const res = reportThroughApi();
      setSubmitMsgVisibleReport(true);
    }
  }

  const reportThroughApi = async () => {
    console.log("REPORTING THROUGH API")
    const username = await SecureStore.getItemAsync('username')
    const information = {
      userReporting: username,
      userReported: otherUsername,
      reportReasonCategory: reportReasonCategory,
      reportReasonWritten: reportReasonWritten,
    }
    const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/reportOtherUser/reportOtherUser', {
      username: username,
      report: information
    }).catch((error) => {
      if (error.response) {
        return error.response.data
      }
    })

    return response
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
    >
      <View style={styles.container}>
        
        <Pressable style={{padding: 6, alignSelf:"flex-start", marginTop: 40}} onPress={onClose}>
          <Ionicons name="chevron-back" size={30} color="gold" />
        </Pressable>


        <Text style={styles.title}>Please fill out information for reporting/blocking this user.</Text>
          {/* Add your reporting/blocking form or options here */}
          
          <Text style={styles.subtitle}>Do you want to report this user?</Text>

          <RNPickerSelect
            placeholder={ {label: "Do you want to report this user", value: null}}
            onValueChange={(value) => setReport(value)}
            value={report}
            items={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
            ]}
            style={pickerSelectStyles}
          /> 

          <Text style={styles.subtitle}>If you are reporting this user, what is the reason? If you are not reporting this user, just select N/A. </Text>

          <RNPickerSelect
            placeholder={ {label: "Reason for reporting this user", value: null}}
            onValueChange={(value) => setReportReasonCategory(value)}
            value={reportReasonCategory}
            items={[
                { label: "N/A", value: "na" },
                { label: "Spam", value: "spam" },
                { label: "Nudity or Sexual Activity", value: "nuditySexual" },
                { label: "Hate Speech or Symbols", value: "hateSpeech" },
                { label: "False Information", value: "falseInformation" },
                { label: "Bullying or Harassment", value: "bullyingOrHarassment" },
                { label: "Scam or Fraud", value: "scamOrFraud" },
                { label: "Violence", value: "Violence" },
                { label: "Other", value: "other" },
            ]}
            style={pickerSelectStyles}
          /> 

          <Text style={styles.subtitle}>If you are reporting this user, would you like to elaborate more on your reason and give any specifics? If you are not reporting this user or do not feel the need to give specifics, just select N/A. </Text>

          <TextInput
            style={styles.input}
            placeholder="Reason"
            value={reportReasonWritten}
            onChangeText={handleReportReasonWritten}
          />

          <Text style={styles.subtitle}>Do you want to block this user?</Text>

          <RNPickerSelect
            placeholder={ {label: "Do you want to block this user", value: null}}
            onValueChange={(value) => setBlock(value)}
            value={block}
            items={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
            ]}
            style={pickerSelectStyles}
          /> 
                    
          <Pressable style={styles.button} onPress={() => {handleSubmit()}}>
            <Text style={styles.modalButtonText}>OK</Text>
          </Pressable>

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
              <Pressable style={styles.modalButton} onPress={() => setErrMsgVisible(!errMsgVisible)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </Modal>

          {/* Modal for invalid fields message */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={invalidEntriesMsgVisible}
            onRequestClose={() => {
              setInvalidEntriesMsgVisible(!invalidEntriesMsgVisible);
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Please make sure that the fields are filled out correctly. There are currently some conflicting answers to the fields.
              </Text>
              <Pressable style={styles.modalButton} onPress={() => setInvalidEntriesMsgVisible(!invalidEntriesMsgVisible)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </Modal>

          {/* Modal for submit message block */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={submitMsgVisibleBlock}
            onRequestClose={() => {
              setSubmitMsgVisibleBlock(false); // Close the "submit" message modal
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                You have successfully reported/blocked this user.
              </Text>
              <Pressable style={styles.modalButton} onPress={() => {setSubmitMsgVisibleBlock(false); onClose(); onCloseConversation();}}>
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </Modal>

          {/* Modal for submit message report */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={submitMsgVisibleReport}
            onRequestClose={() => {
              setSubmitMsgVisibleReport(false); // Close the "submit" message modal
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                You have successfully reported/blocked this user.
              </Text>
              <Pressable style={styles.modalButton} onPress={() => {setSubmitMsgVisibleReport(false); onClose();}}>
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </Modal>

        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 0, // Set to 0 to cover the entire screen
    width: '100%', // Set to 100% to cover the entire screen width
    height: '100%', // Set to 100% to cover the entire screen height
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: 'center',
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
  buttonText: {
    fontSize: 15,
    alignSelf: "center"
  },
  button: {
    width: "15%",
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
    justifyContent: 'flex-start',
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
    marginTop: 20,
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

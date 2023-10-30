import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, TextInput} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from "react-native-picker-select"

export default function ReportBlockModal({ visible, onClose }) {
  
  const [report, setReport] = useState('');
  const [reportReasonCategory, setReportReasonCategory] = useState('');
  const [reportReasonWritten, setReportReasonWritten] = useState('');
  const [block, setBlock] = useState('');

  const handleReportReasonWritten = (text) => {
    setReportReasonWritten(text);
  };

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

          <Text style={styles.subtitle}>If you are reporting this user, would you like to elaborate more on your reason and give any specifics? If you are not reporting this user, just select N/A. </Text>

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
                    
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </Pressable>

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

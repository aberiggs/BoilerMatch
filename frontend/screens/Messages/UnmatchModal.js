import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable, TextInput} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from "react-native-picker-select"
import * as SecureStore from 'expo-secure-store'
import axios from "axios"

export default function ConfirmationModal({ visible, onClose, onReport, onUnmatch }) {
    return (
      <Modal transparent={true} visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.title}>Choose an option:</Text>
  
          <TouchableOpacity style={styles.button} onPress={onReport}>
            <Text style={styles.modalButtonText}>Report</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.button} onPress={onUnmatch}>
            <Text style={styles.modalButtonText}>Unmatch</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
    
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    button: {
      width: '50%',
      height: 40,
      backgroundColor: 'gold',
      borderRadius: 6,
      justifyContent: 'center',
      alignSelf: 'center',
      margin: 10,
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
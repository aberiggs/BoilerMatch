import React from 'react';
import { View, Modal, Text, Button, StyleSheet, Pressable } from 'react-native';
import axios from "axios"

const AwaitRateModal = ({ visible, username, currentUser, onClose }) => {
  const closeAwaitModal = () => {
    onClose();
  };

  const onRequest = () => {
    console.log('Request permission action');
    requestPermission()
  };

  const requestPermission = async () => {
    // TODO: .env for dev/production environments
    console.log("Calling function!!!")
    const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getPermission', {
        username: username,
        currentUser: currentUser
    }).catch((error) => {
      if (error.response) return error.response.data
    })

    return response
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeAwaitModal}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalText}>
          You do not have permission to rate this user. Would you like to request permission?
        </Text>
        
        <View style={styles.buttonContainer}>
            <Pressable style={styles.closeButton} onPress={onRequest}>
                <Text style={styles.closeButtonText}>Request</Text>
            </Pressable>

            <Text style={styles.modalText}>
          
            </Text>

            <Pressable style={styles.closeButton} onPress={closeAwaitModal}>
                <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
        </View>
      </View>
    </Modal>
  );
};

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
  closeButton: {
    backgroundColor: "gold",
    borderRadius: 6,
    justifyContent: 'center',
    width: 'auto',
    alignSelf: 'center',
    padding: 10
  },
  buttonSeparator: {
    width: 10, 
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
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 20,
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

export default AwaitRateModal;
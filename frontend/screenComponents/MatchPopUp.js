import { View, Text, Modal, Pressable, StyleSheet} from 'react-native'
import React from 'react'
import Ionic from "react-native-vector-icons/Ionicons"

const MatchPopUp = ({user, hideMatchPopUp}) => { 
  return (
   
    <Modal
      animationType="slide"
      transparent={true}
      visible={user!=null}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        hideMatchPopUp();
      }}>
      <View style={styles.container}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>You matched with {user}!</Text>
          <Pressable
            style={[styles.button]}
            onPress={() => hideMatchPopUp()}>
            <Text style={styles.textStyle}>Start Chatting!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'gold',
  },
  textStyle: {
    color: 'grey',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default MatchPopUp

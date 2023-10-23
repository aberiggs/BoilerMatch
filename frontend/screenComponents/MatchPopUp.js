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
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>You matched with </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => hideMatchPopUp()}>
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
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
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default MatchPopUp

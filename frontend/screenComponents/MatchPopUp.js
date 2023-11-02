import { View, Text, Modal, Pressable, StyleSheet, TouchableOpacity} from 'react-native'
import {useState, useEffect} from 'react'
import Ionic from "react-native-vector-icons/Ionicons"
import { Avatar } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const MatchPopUp = ({matchedUser, hideMatchPopUp}) => { 
  const [username, setUsername] = useState("")
  

  useEffect(() => {
    fetchUsername()
  },[]);

  const fetchUsername = async () => {
    const userVal = await SecureStore.getItemAsync('username')
    setUsername(userVal)
  }

  return (
    matchedUser==null?
    <></>:
    <Modal
    animationType="fade"
    transparent={true}
      visible={matchedUser!=null}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        hideMatchPopUp();
      }}>
      <View style={styles.container}> 
        <View style={styles.modalView}>
        <TouchableOpacity style = {{alignSelf:"flex-end"}} onPress={() => hideMatchPopUp()}>
      <Ionicons name={"close-circle-outline"} size={30} color={"black"} />
      </TouchableOpacity>
      <View style={{padding:15}}>

      
          <View style={{flexDirection:"row", alignSelf:"center"}}>
            <Avatar
            size={100}
            rounded
            source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + username + '.jpg'}}
            containerStyle={{backgroundColor: 'grey', margin: 10, alignSelf: 'center'}}
            activeOpacity={0.8}
          />
          <Avatar
            size={100}
            rounded
            source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + matchedUser.username+ '.jpg'}}
            containerStyle={{backgroundColor: 'grey', margin: 10, alignSelf: 'center'}}
            activeOpacity={0.8}
          />

          </View>
          <Text style={styles.modalText}>You Matched With {matchedUser.information.firstName} {matchedUser.information.lastName}!</Text>
          <Pressable
            style={[styles.button]}
            onPress={() => hideMatchPopUp()}>
            <Text style={styles.textStyle}>Start Chatting</Text>
          </Pressable>
        </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    
    backgroundColor: 'white',
    borderRadius: 20,
    padding:20,
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
    color: 'rgb(105,105,105)',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    marginTop:10,
    textAlign: 'center',
    fontSize: 18
  },
});

export default MatchPopUp

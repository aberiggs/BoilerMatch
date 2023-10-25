import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';

import Conversation from './Conversation';


export default function ChatRoom({navigation}) {
    const [chatOpened, setChatOpened] = useState(true) 


    return(
        <View style={styles.container}>
        <Text>this is the chat room</Text>
        <Modal
          animationType="slide"
          transparent={false}
          visible={chatOpened}>
            
            <Conversation />
        </Modal>
       </View>
    )



}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
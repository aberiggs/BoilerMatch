import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable } from 'react-native';

import Conversation from './Conversation';


export default function ChatRoom({navigation}) {
    const [chatOpened, setChatOpened] = useState(false) 


    const ConversationModal = () => {
      console.log("aaa")
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={chatOpened}>
            <Conversation onClose={() => setChatOpened(false)}/>
        </Modal>
      )
    }

    return(
        <View style={styles.container}>
        <ConversationModal />
        <Text>this is the chat room</Text>
        <Pressable onPress={() => setChatOpened(true)}>
          <Text>
            Open Chat
          </Text>
        </Pressable>
        
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
  
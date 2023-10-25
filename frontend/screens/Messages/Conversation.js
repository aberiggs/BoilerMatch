import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, KeyboardAvoidingView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Conversation({navigation}){
    const [newMessage, setNewMessage] = useState('')

    const sendMessage = () => {
        Alert.alert('Send Message', 'Not implemented :)', [
           {text: 'OK'},
          ]);
    }

    return(
        <KeyboardAvoidingView behavior={'padding'} style={conversationStyles.container}>
            <SafeAreaView style={conversationStyles.convoContainer}>
                <ScrollView style={conversationStyles.chatScrollView}>
                    <Text>
                        THIS IS A CONVERSATION
                    </Text>
                </ScrollView>

                <View style={conversationStyles.messageContainer}>
                    <TextInput
                        placeholder='Message'
                        placeholderTextColor='gray'

                        onChangeText={message => setNewMessage(message)}

                        style={conversationStyles.messageField}
                    />
                    <Pressable onPress={() => sendMessage()}>
                        <Ionicons name="send-outline" size={24} color="black" />
                    </Pressable>
                </View>
                
            </SafeAreaView>
        </KeyboardAvoidingView>
    )



}


const conversationStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      width: '100%'
    },
    convoContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    chatScrollView: {
        backgroundColor: 'pink',
        width: '80%',

    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'lightblue',
        borderRadius: 50,
        borderWidth: 1,
        width: '80%',
        height: 40,
        margin: 10,
        paddingHorizontal: 10
    },
    messageField: {
        color:"black",
        width: "80%",
        borderColor: 'black',
        padding: 10,
        borderRadius: 50,
        height: '100%',
    }
  });
  
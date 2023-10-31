import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, KeyboardAvoidingView, Pressable, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import ReportBlockModal from './ReportBlockModal'; // Import the ReportBlockModal component

import axios from "axios"


// const messagesEx = [
//         {
//             from: "A",
//             message: "Yo what's up"
//         },
//         {
//             from: "B",
//             message: "Test text one"
//         },
//         {
//             from: "A",
//             message: "This is a bunch of of test text to see what happens when you create a larger message"
//         },
//         {
//             from: "B",
//             message: "💥💥💥"
//         },

//     ]

export default function Conversation(props, {navigation}) {
    const [currentMessages, setCurrentMessages] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const [username, setUsername] = useState(null)

    const [reportBlockModalVisible, setReportBlockModalVisible] = useState(false);

    const openReportBlockModal = () => {
        setReportBlockModalVisible(true);
    };

    const closeReportBlockModal = () => {
        setReportBlockModalVisible(false);
    };

    const otherUser = props.otherUser

    useEffect(() => {
        initialize()
    },[])

    const initialize = async () => {
        const userVal = await SecureStore.getItemAsync('username')
        setUsername(userVal)
        //TODO: Fix so that if the request fails, we're not just infinitely spamming
        let continueFetching = true
        let messageList = currentMessages
        while (continueFetching) {
            console.log("Fetching")
            messageList = await fetchMessages(messageList)
            setCurrentMessages(messageList)
            if (!messageList) {
                console.log("No message list")
                continueFetching = false
            }
        }
    }

    const fetchMessages = async (previousMessages) => {
        const tokenVal = await SecureStore.getItemAsync('token')
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/messages/getConversation', {
            token: tokenVal,
            otherUser: otherUser,
            previousMessages: previousMessages
        }).catch(error => {
            console.log("Couldn't fetch messages")
            return null
        })
        
        if (!response) {
            console.log("No response for messages")
            return null
        }

        //console.log(response.data)
        if (response.data.messages) {
            return response.data.messages
        }
        return null

    }

    const sendMessage = async () => {
        console.log("Sending Message")
        const messageObj = {from: username, message: newMessage}
        const updatedMessages = (currentMessages ? currentMessages : [])
        updatedMessages.push(messageObj)
        setCurrentMessages(updatedMessages)
        setNewMessage('')

        const tokenVal = await SecureStore.getItemAsync('token')
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/messages/send', {
            token: tokenVal,
            toUser: otherUser,
            messageToSend: newMessage
        }).catch(error => {
            console.log("Couldn't send messages: ", error.response.data)
            return null
        })
        
        if (!response) {
            console.log("No response for sending message")
            return false
        }
    }

    const messageItem = ({item}) => {
        
        const messageContainerStyle = (item.from === username) ? conversationStyles.currentUserMsg : conversationStyles.otherUserMsg
        const messageBoxStyle = (item.from === username) ? conversationStyles.currentUserMessageBox : conversationStyles.otherUserMessageBox

        return (
            <View style={messageContainerStyle}>
                <View style={messageBoxStyle}>
                    <Text style={conversationStyles.messageText}>{item.message}</Text>
                </View>
            </View>
        )
    }

    return(
        <SafeAreaView style={{height: '100%', width: '100%'}}>
            <View style={conversationStyles.headingContainer}>
                <View style={{width: '30%', alignItems: 'left'}}>
                    <Pressable style={{padding: 6}} onPress={() => props.onClose()}>
                        <Ionicons name="chevron-back" size={30} color="gold" />
                    </Pressable>
                </View>
                
                <View style={{width: '30%', alignItems: 'center'}}>
                    <Text style={{}}>{otherUser}</Text>
                </View>
                {/* <View style={{width: '30%'}} /> */}
                <View style={{width: '30%', alignItems: 'right'}}>
                    <TouchableOpacity style={conversationStyles.button} onPress={openReportBlockModal}>
                        <Text style={conversationStyles.buttonText}>Block or Report</Text>
                    </TouchableOpacity>
                    {/* do below code for an information button */}
                    {/* <Pressable style={{paddingLeft:80}}>
                        <Ionicons name="information-circle-outline" size={30} color="gold" />
                    </Pressable> */}
                </View>
            </View>

            <KeyboardAvoidingView behavior={'padding'} removeClippedSubview={false} style={conversationStyles.convoContainer}>
                <FlatList
                    style={conversationStyles.chatScrollView}
                    data={currentMessages}
                    renderItem={({item}) => messageItem({item})}
                />

                <View style={conversationStyles.messageContainer}>
                    <TextInput
                        placeholder='Message'
                        placeholderTextColor='gray'
                        value={newMessage}

                        onChangeText={message => setNewMessage(message)}

                        style={conversationStyles.messageField}
                    />

                    <Pressable onPress={() => sendMessage()}>
                        <Ionicons name="send-outline" size={24} color="black" />
                    </Pressable>
                </View>

            </KeyboardAvoidingView>
            <ReportBlockModal visible={reportBlockModalVisible} onClose={closeReportBlockModal} onCloseConversation={props.onClose} />
        </SafeAreaView>
    )



}


const conversationStyles = StyleSheet.create({
    buttonText: {
      fontSize: 15,
      alignSelf: "center"
    },
    button: {
      width: "100%",
      height: 40,
      backgroundColor: "gold",
      borderWidth: 1,
      borderRadius: 6,
      borderBlockColor : "black",
      justifyContent: 'center',
      alignSelf: 'center',
    },
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
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height: '8%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'darkgrey',
    },
    chatScrollView: {
        width: '95%',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    },
    currentUserMsg: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-end'
    },
    otherUserMsg: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
    },
    currentUserMessageBox: {
        maxWidth: '75%',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        margin: 10,
        backgroundColor: 'gold'
    },
    otherUserMessageBox: {
        maxWidth: '75%',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        margin: 10,
        backgroundColor: 'lightgrey',
    },
    messageText: {
        fontSize: 15,
    }
  });
  
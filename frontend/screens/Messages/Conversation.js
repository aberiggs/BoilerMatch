import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, KeyboardAvoidingView, Pressable, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const messagesEx = [
        {
            from: "A",
            message: "Yo what's up"
        },
        {
            from: "B",
            message: "Test text one"
        },
        {
            from: "A",
            message: "This is a bunch of of test text to see what happens when you create a larger message"
        },
        {
            from: "B",
            message: "💥💥💥"
        },

    ]
export default function Conversation(props, {navigation}){
    const [newMessage, setNewMessage] = useState('')

    const sendMessage = () => {
        Alert.alert('Send Message', 'Not implemented :)', [
           {text: 'OK'},
          ]);
    }

    const messageItem = ({item}) => {
        
        const messageContainerStyle = (item.from === "A") ? conversationStyles.currentUserMsg : conversationStyles.otherUserMsg
        const messageBoxStyle = (item.from === "A") ? conversationStyles.currentUserMessageBox : conversationStyles.otherUserMessageBox

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
                    <Text style={{}}>User</Text>
                </View>
                <View style={{width: '30%'}} />
            </View>

            <KeyboardAvoidingView behavior={'padding'} style={conversationStyles.convoContainer}>
                <FlatList
                    style={conversationStyles.chatScrollView}
                    data={messagesEx}
                    renderItem={({item}) => messageItem({item})}
                />

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

            </KeyboardAvoidingView>
        </SafeAreaView>
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
  
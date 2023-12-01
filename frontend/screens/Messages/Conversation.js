import { useEffect, useState, useContext, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, KeyboardAvoidingView, Pressable, Alert, FlatList, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import ReportBlockModal from './ReportBlockModal'; // Import the ReportBlockModal component
import { Avatar } from '@rneui/themed';

import UnmatchModal from './UnmatchModal'; // Import the ReportBlockModal component

import themeContext from '../../theme/themeContext';
import UserProfile from '../MainFeed/UserProfile'
import { useReadReceipts } from '../../ReadReceiptsContext';


//FIX THE enablednotificaitons to be in sync with the othe stuff
import axios from "axios"
import { enableExperimentalWebImplementation } from 'react-native-gesture-handler';

export default function Conversation(props, {navigation}) {
    const [currentMessages, setCurrentMessages] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const [username, setUsername] = useState(null)
    const theme = useContext(themeContext)
    const { readReceiptsEnabled, setReadReceiptsEnabled } = useReadReceipts();

    const [reportBlockModalVisible, setReportBlockModalVisible] = useState(false);
    const [UnmatchModalVisible, setUnmatchModalVisible] = useState(false);
    const [otherUserKey, setOtherUserKey] = useState(null)
    const [isUserModalVisible,setIsUserModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [enabledNotifications, setEnabledNotifications] = useState(true)
    const isAlertDisplayedRef = useRef(false)

    const openUnmatchModal = () => {
        setUnmatchModalVisible(true);
    };

    const closeUnmatchModal = () => {
        setUnmatchModalVisible(false);
    };

    const openReportBlockModal = () => {
        setReportBlockModalVisible(true);
    };

    const closeReportBlockModal = () => {
        setReportBlockModalVisible(false);
    };
    const handleUserItemClick = (user) => {
        setSelectedUser(user);
        setIsUserModalVisible(true);
        console.log("Touched");
      };
      const handleCloseUserModal = () => {
        setIsUserModalVisible(false);
      };
      const notiThroughApi = async() => {
        console.log("NOTI THROUGH API")
        const tokenVal = await SecureStore.getItemAsync('token')
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/notiOtherUser', {
          token: tokenVal,
          userNoNoti: otherUser,
          setting: enabledNotifications
        }
        ).catch(error => {
          console.log("Error occurred while blocking users:", error)
        
        })
       // console.log(response)
    }

    useEffect(() => { 
        const myNoti = async () => {
            try {
                const tokenVal = await SecureStore.getItemAsync('token');
                const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/fetchMyNotiPref', {
                    params: {
                        token: tokenVal,
                        userNoNoti: otherUser,
                    },
                });
                console.log("myNoti response: ", response.data.valid);
                if (response) {
                setEnabledNotifications(response.data.valid);
                }
            } catch (error) {
                console.log("Error occurred while fetching notification preferences:", error);
            }
        };
    
        myNoti();
    }, []); // Remove enabledNotifications from the dependency array to avoid unnecessary re-renders
    
    
    const handleSwitchToggle = async (value) => {
        if (isAlertDisplayedRef.current) {
            return; // If an alert is displayed, don't toggle the switch
          }
          const tokenVal = await SecureStore.getItemAsync('token')
          const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/fetchNotiPref', {
            params: {
                token: tokenVal,
                userNoNoti: otherUser,
              }
        }).catch(error => {
            console.log("Couldn't fetch messages")
            isAlertDisplayedRef.current = true;
            Alert.alert('Unable to update notifications', null, [
            
                {
                  text: 'OK',
                  onPress: () => {
                    isAlertDisplayedRef.current = false;
                    console.log(isAlertDisplayedRef.current)
                    // Reset the temporary state to the previous value
                   //console.log("tempnoti", temporaryNotificationsEnabled)
                    setEnabledNotifications((prevState) => !prevState);
                    //setNotificationsEnabled(temporaryNotificationsEnabled);
                    //console.log("tempnoti after", temporaryNotificationsEnabled)
                  },
                },
                ]);
        })
          
        console.log("handleSwitch value", value);
        setEnabledNotifications(value);
    };
    
    useEffect(() => {
        console.log("after setting in toggle", enabledNotifications);
        notiThroughApi(); // Call your API function here or use useEffect for better control
    }, [enabledNotifications]);
    
    

    const otherUser = props.otherUser
    const user = props.user
    //console.log("conversations props", props.enabled)

    useEffect(() => {
        initialize();
    },[])
    
    
      //fetchUser(otherUser)

    //console.log("otherUserKey", props)
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
        // if (response.data.messages) {
        //     return response.data.messages
        // }
        if (response.data.messages) {
            // Initialize the reactions property for each message
            const messagesWithReactions = response.data.messages.map((msg) => ({
                ...msg,
                reactions: msg.reactions || [],
            }));
            return messagesWithReactions;
        }
        return null

    }

    const sendMessage = async () => {
        console.log("Sending Message")
        const messageObj = {from: username, message: newMessage, reactions: []}
        const updatedMessages = (currentMessages ? currentMessages : [])
        updatedMessages.push(messageObj)
        setCurrentMessages(updatedMessages)

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

        const valid = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/fetchNotiPref', {
            params: {
                token: tokenVal,
                userNoNoti: otherUser,
              }
        }
        ).catch(error => {
          console.log("Error occurred while blocking users:", error)
        })
        console.log("valid: ", valid.data.valid)
        console.log("enabledNoti", enabledNotifications)
        if (valid.data.valid){
        await sendMessageNotification()
        }
        setNewMessage('')
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
    
        // Convert hours from 24-hour format to 12-hour format
        const formattedHours = hours % 12 || 12;
    
        // Pad single-digit minutes with a leading zero
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
        // Get the month, day, and year
        const month = date.getMonth() + 1; // Months are 0-indexed
        const day = date.getDate();
        const year = date.getFullYear();

        // Get the last two digits of the year
        const lastTwoYearDigits = String(year).slice(-2);
    
        // Format the date part as MM/DD/YYYY
        const formattedDate = `${month}/${day}/${lastTwoYearDigits}`;
    
        return `${formattedDate}\n ${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    // Function to find the most recently read message
    function findMostRecentReadMessage(messages) {
        let mostRecentReadMessage = null;
        for (const message of messages) {
        if (message.read && message.readTime !== 'no') {
            if (!mostRecentReadMessage || message.readTime > mostRecentReadMessage.readTime) {
            mostRecentReadMessage = message;
            }
        }
        }
        return mostRecentReadMessage;
    }

    async function sendMessageNotification() {
        // console.log("Sending like noti: ", recipientNotificationToken, senderUsername)

        const pushTokenRes = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getNotiToken', {
            name: otherUser,
          }).catch((error) => {
            if (error.response) {
              console.log("error")
            }
          });
          
        if (!pushTokenRes || !pushTokenRes.data || !pushTokenRes.data.notificationToken) {
        return
        }

        const notifData = {
            to: pushTokenRes.data.notificationToken,
            title: username + " sent a message",
            body: newMessage,
            data: {
                type: "message"
            }
          }

       // console.log(notifData)

        

        
        

        const res = await axios.post('https://exp.host/--/api/v2/push/send', notifData, {
          headers: {
            'host': 'exp.host',
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate',
            'content-type': 'application/json'
          }
        }).catch((err) => {
          console.log("Sending message failed: ", err)
        })
  
        //console.log(res.data)
      }
    
    //   const handleReaction = (message) => {
    //     const updatedMessages = currentMessages.map((msg) => {
    //         if (msg === message) {
    //             if (msg.reactions.includes(username)) {
    //                 msg.reactions = msg.reactions.filter((user) => user !== username); // Remove reaction
    //             } else {
    //                 msg.reactions.push(username); // Add reaction
    //             }
    //         }
    //         return msg;
    //     });
    
    //     setCurrentMessages(updatedMessages);
    // };

    // const handleUndoReaction = (message) => {
    //     const updatedMessages = currentMessages.map((msg) => {
    //         if (msg === message) {
    //             msg.reactions = msg.reactions.filter((user) => user !== username); // Remove reaction
    //         }
    //         return msg;
    //     });
    
    //     setCurrentMessages(updatedMessages);
    // };

    const handleToggleReaction = async (item) => {
        const updatedMessages = currentMessages.map((msg) => {
            if (msg === item) {
                if (msg.reactions.includes(username)) {
                    msg.reactions = msg.reactions.filter((user) => user !== username); // Remove reaction
                } else {
                    msg.reactions.push(username); // Add reaction
                }
            }
            return msg;
        });
    
        setCurrentMessages(updatedMessages);

        const tokenVal = await SecureStore.getItemAsync('token')
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/messages/updateReaction', {
            token: tokenVal,
            otherUser: otherUser,
            timestamp: item.timestamp,
            reactions: item.reactions.includes(username) ? [username] : [],
        }).catch((error) => {
            console.log("Couldn't update reaction status:", error.response.data);
            // Handle the error as needed
        });
    };

    const allowDeletion = (item) => {
        if (item.from !== username) {
            return false
        }

        let timeDiff = Math.abs(new Date() - Date.parse(item.timestamp))
        timeDiff = Math.floor(timeDiff / 1000) // Seconds
        timeDiff = Math.floor(timeDiff / 60) // Minutes

        if (timeDiff >= 5) {
            return false
        }

        return true
    }

    const deleteMessage = async (item) => {
        console.log("Deleting", item)

        const tokenVal = await SecureStore.getItemAsync('token')
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/messages/deleteMessage', {
            token: tokenVal,
            otherUser: otherUser,
            timestamp: item.timestamp,
        }).catch((error) => {
            console.log("Couldn't delete message", error.response.data);
            // Handle the error as needed
        });

        const updatedHistory = await fetchMessages()
        setCurrentMessages(updatedHistory)
    }
    
    const messageItem = ({ item }) => {
        const messageContainerStyle = item.from === username ? conversationStyles.currentUserMsg : conversationStyles.otherUserMsg;
        const messageBoxStyle = item.from === username ? conversationStyles.currentUserMessageBox : conversationStyles.otherUserMessageBox;
        const isCurrentUser = item.from === username;
        return (
            <View style={[messageContainerStyle]}>
                {allowDeletion(item) &&
                    <TouchableOpacity onPress={() => deleteMessage(item)}>
                         <Ionicons name="remove-circle" size={20} color="red" />
                    </TouchableOpacity>
                }
                <View style={messageBoxStyle}>
                    <Text style={conversationStyles.messageText}>{item.message}</Text>
                </View>
                <View style={conversationStyles.timestampContainer}>
                    <Text style={[conversationStyles.timestampText, {color:theme.color}]}>
                        {formatTimestamp(item.timestamp)}
                    </Text>
                </View>
                {readReceiptsEnabled && item.from === username && item.read && (
                    <View>
                        <Text style={conversationStyles.readReceiptText}>
                            {/* {formatTimestamp(item.readTime)} - R */}
                            {"R"}
                        </Text>
                    </View>
                )}
                {item.from !== username && (
                    <TouchableOpacity onPress={() => handleToggleReaction(item)}>
                        <Ionicons name="thumbs-up" size={15} color={item.reactions.includes(username) ? 'black' : 'grey'} />
                    </TouchableOpacity>
                )}
                {item.from === username && item.reactions.includes(otherUser) && (
                    <Ionicons name="thumbs-up" size={15} color="black" />
                )}
            
            </View>
        );
    };

    //console.log("otherUser", otherUser);
    return(
        <SafeAreaView style={{height: '100%', width: '100%', backgroundColor:theme.background}}>
            <View style={[conversationStyles.headingContainer, {backgroundColor:theme.background}]}>
                <View style={{width: '30%', alignItems: 'left', backgroundColor:theme.backgroundColor}}>
                    <Pressable style={{padding: 6}} onPress={() => props.onClose()}>
                        <Ionicons name="chevron-back" size={30} color="gold" />
                    </Pressable>
                </View>
                <TouchableOpacity onPress={() => handleUserItemClick(props.otherUserItem)}>
                <View style={{width: '30%', alignItems: 'center', justifyContent: 'center', color:theme.color }}>
                    
                <Avatar
                        size={110}
                        rounded
                        source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + otherUser + '.jpg'}}
                        containerStyle={{backgroundColor: 'grey', margin: 10, alignSelf: 'center'}}
                        activeOpacity={0.8}
                    />
                
                </View>
                </TouchableOpacity>
                <View style={{width: '30%', alignItems: 'center', justifyContent: 'center', color:theme.color}}>
                    <Text style={{fontSize: 24, color:theme.color}}>{otherUser}</Text>
                </View>
                <View style={conversationStyles.buttonContainer}>
                    
                <Switch
                    value={enabledNotifications}
                    onValueChange={(value) => {
                        handleSwitchToggle(value)
                        Alert.alert(`You ${(enabledNotifications) ? 'will not' : 'will'} recieve notifications from ${otherUser}`, null, [
                            {
                              text: 'OK',
                              onPress: () => {
                                // Reset the temporary state to the previous value
                              },
                            },
                            ]);
                    }}
                    disabled={isAlertDisplayedRef.current}

                    ></Switch>
                    <TouchableOpacity style={conversationStyles.button} onPress={openUnmatchModal}>
                            <Text style={[conversationStyles.buttonText,{color:theme.color}]}>Unmatch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={conversationStyles.button} onPress={openReportBlockModal}>
                        <Text style={conversationStyles.buttonText}>Block</Text>
                    </TouchableOpacity>

 
                </View>
            </View>
            {selectedUser && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={isUserModalVisible}
          >
            <UserProfile user={selectedUser} closeModal={handleCloseUserModal}/>
          </Modal>
        )}
            <KeyboardAvoidingView behavior={'padding'} removeClippedSubview={false} style={[conversationStyles.convoContainer, {backgroundColor:theme.background}]}>
                <FlatList
                    style={[conversationStyles.chatScrollView, {backgroundColor:theme.backgroundColor}]}
                    data={currentMessages}
                    renderItem={({item}) => messageItem({item})}
                />

                <View style={conversationStyles.messageContainer}>
                    <TextInput
                        placeholder='Message'
                        placeholderTextColor='gray'
                        value={newMessage}

                        onChangeText={message => setNewMessage(message)}

                        style={[conversationStyles.messageField, {color:theme.color}]}
                    />

                    <Pressable onPress={() => sendMessage()}>
                        <Ionicons name="send-outline" size={24} color="black" />
                    </Pressable>
                </View>

            </KeyboardAvoidingView>
            <UnmatchModal visible={UnmatchModalVisible} onClose={closeUnmatchModal} onCloseConversation={props.onClose} otherUsername={otherUser} />
            <ReportBlockModal visible={reportBlockModalVisible} onClose={closeReportBlockModal} onCloseConversation={props.onClose} otherUsername={otherUser} />
        </SafeAreaView>
    )
}


const conversationStyles = StyleSheet.create({
    buttonText: {
      fontSize: 12,
      alignSelf: "center"
    },
    button: {
      width: "80%",
      paddingVertical: 10,
      marginVertical: 5,
      backgroundColor: "gold",
      borderWidth: 1,
      borderRadius: 6,
      borderBlockColor : "black",
      justifyContent: 'center',
      alignSelf: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: 'gold',
      alignItems: 'center',
      width: '100%'
    },
    buttonContainer: {
        flexDirection: 'column', // Display buttons horizontally
        justifyContent: 'space-between', // You can change this to 'space-between' for different spacing
        width: '80%',
        padding: 10
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
        height: '16%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'gold',
        backgroundColor: "gold"
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
        margin: 5,
        backgroundColor: 'gold'
    },
    otherUserMessageBox: {
        maxWidth: '75%',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        margin: 5,
        backgroundColor: 'lightgrey',
    },
    messageText: {
        fontSize: 15,
    },
    timestampLeft: {
        fontSize: 12, // Adjust the font size as needed
        color: 'gray', // Color of the timestamp for messages sent by other users
        alignSelf: 'flex-start', // Align on the left
        //marginHorizontal: 10, // Add margin for spacing
    },
    timestampRight: {
        fontSize: 12, // Adjust the font size as needed
        color: 'gray', // Color of the timestamp for messages sent by you
        alignSelf: 'flex-end', // Align on the right
        //marginHorizontal: 10, // Add margin for spacing
    },
    timestampText: {
        fontSize: 12, // Adjust the font size as needed
        color: 'gray', // Color of the timestamp for messages sent by you
        marginHorizontal: 10, // Add margin for spacing
        alignSelf: 'center',
    },
     timestampContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 4, // Adjust the margin to control the space between the message and the timestamp
    },
    timestampText: {
        fontSize: 10,
        color: 'gray',
    },
    readReceiptText: {
        fontSize: 10,
        color: 'green',
        margin: 3,
    },
});





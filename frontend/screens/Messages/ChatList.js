import { StatusBar } from 'expo-status-bar';
import Conversation from './Conversation';
import {StyleSheet, Text, View,TouchableOpacity,TextInput, Modal, Button, Image, Pressable, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import { Avatar } from '@rneui/themed';
import { RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import themeContext from '../../theme/themeContext';

import { useFocusEffect } from '@react-navigation/native';

export default function ChatList({navigation,chatReloaded}) {

    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showOnlyUsersLikedBy, setShowOnlyUsersLikedBy] = useState(false)
    const theme = useContext(themeContext)

    const [searchTerm, setSearchTerm] = useState('');
    //variables for dropdown
    const [searchResults, setSearchResults] = useState([])

    const [chatOpened, setChatOpened] = useState(false) 

    const [selectedUser, setSelectedUser] = useState('')

    const [unreadMessagesList, setUnreadMessagesList] = useState([]);

    const [otherUsers, setOtherUsers] = useState([])
    
    const [currentMessages, setCurrentMessages] = useState(null)

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const [username, setUsername] = useState(null);

    useEffect(() => {
      initialize()
    },[])

    const initialize = async () => {
      const userVal = await SecureStore.getItemAsync('username')
      setUsername(userVal)

      // get matches to go through conversations for unread messages
      const tokenVal = await SecureStore.getItemAsync('token')
  
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getMatchesForUser', {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occurred while pulling users", error)
      })
      // console.log(response.data)
      if (response.data.users.length > 0) {
        const sortedUsers = response.data.users.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        console.log("INITIALIZED SORTED USERS", sortedUsers)
        const usernames = sortedUsers.map(user => user.otherUser.username);
        fetchUnreadMessages(usernames);
      }
    }
    
    const fetchSearchMessages = async (text) => {
      try {
        // get token value and set it as config to send in API call
        const tokenVal = await SecureStore.getItemAsync('token'); 
        const config = {
          headers: {
            authorization: tokenVal
          }
        };

        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_API_HOSTNAME}/api/messages/search/${text}`,
          config
        );
    
        // Check if the response status is 200 (OK)
        if (response.status === 200) {
          // Check if there are messages in the response
          if (response.data.messages.length > 0) {
            console.log("RESPONSE", response.data.messages)
            setSearchResults(response.data.messages);
            // Set your dropdown visibility state here if needed.
            setIsDropdownVisible(response.data.messages.length > 0)
          } else {
            // Show a pop-up message saying that no messages match.
            setIsDropdownVisible(false);
            console.log("No messages match")
          }
        } else {
          // Handle non-200 status codes if needed.
          console.log(`Received a non-200 status code: ${response.status}`);
        }
      } catch (error) {
        console.log("Error occurred while searching for messages:", error);
        setIsDropdownVisible(false);
        // Handle the error as needed.
      }
    };

    console.log("SEARCH RESULTS", searchResults)

    const dataFromSearch = searchResults.map(item => ({
      users: [item.userOne, item.userTwo],
      sender: item.messages.from,
      message: item.messages.message,
      timestamp: item.messages.timestamp,
    }));
    const sortedDataFromSearch = dataFromSearch.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


    useEffect(() => {
      handleRefreshFeed()
    },[chatReloaded]);

    // useFocusEffect(
    //   React.useCallback(() => {
    //     handleRefreshFeed();
    //   }, [])
    // );
   
    const handleRefreshFeed = async() => {
      const tokenVal = await SecureStore.getItemAsync('token')
  
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getMatchesForUser', {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occurred while pulling users", error)
      })
      // console.log(response.data)
      if (response.data.users.length > 0) {
        const sortedUsers = response.data.users.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        console.log("SORTED USERS: ", sortedUsers)
        setDisplayedUsers(sortedUsers);
      }
      else{
        setDisplayedUsers([])
      }
    }
    
    const handleChatClosed = () => {
      setChatOpened(false)
      handleRefreshFeed()
      console.log("chatClosed")
    }

    const ConversationModal = () => {
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={chatOpened}>
            <Conversation otherUser={selectedUser} onClose={handleChatClosed}/>
        </Modal>
      )
    }
  
    const handleChatPress = async (user) => {
      console.log("INPUT", user)
      if (user) {
        setSelectedUser(user.username);
        setChatOpened(true);
        console.log("CHAT PRESSED");
        console.log("OTHER USER", user.username)
      } else {
        console.log("User is undefined");
      }
    };

    const handleChatPressSearch = async (user) => {
      if (user) {
        setSelectedUser(user);
        setChatOpened(true);
      } else {
        console.log("User is undefined");
      }
    };
  
    const onRefresh = async() => {
      setRefreshing(true);
      //setUsersLiked({})
      handleRefreshFeed();
      // ... Fetch data ...
      setRefreshing(false);
    };

  //   useEffect(() => {
  //     console.log(" ")
  //     console.log("TEST INITIALIZEEEEEE -------------------")
  //     console.log(" ")
  //     initialize()
  //   },[])

  //   const initialize = async () => {
  //     const tokenVal = await SecureStore.getItemAsync('token')
  
  //     const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getMatchesForUser', {
  //       token: tokenVal
  //     }
  //     ).catch(error => {
  //       console.log("Error occurred while pulling users", error)
  //     })
  //     // console.log(response.data)
  //     if (response.data.users.length > 0) {
  //       const sortedUsers = response.data.users.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  //       console.log("SORTED USERS: ", sortedUsers)
  //       setDisplayedUsers(sortedUsers);
        
  //       // Extract usernames and lastUpdated times and store them in an array
  //       const usersAndUpdates = sortedUsers.map(user => ({
  //         username: user.otherUser.username,
  //         lastUpdated: user.lastUpdated
  //       }));

  //       console.log("USERS AND UPDATES", usersAndUpdates)
        
  //       // Set the array in state
  //       setOtherUsersAndUpdates(usersAndUpdates);
  //     }
      
  //     let continueFetching = true
  //     let messageList = currentMessages
  //     console.log("CONTINUE FETCHING")
  //     while (continueFetching) {
  //         messageList = await fetchUnreadMessages(otherUsersAndUpdates, messageList)
  //         setCurrentMessages(messageList)
  //         if (!messageList) {
  //             console.log("No message list")
  //             continueFetching = false
  //         }
  //     }
  // }
    
    //iter 1
    const fetchUnreadMessages = async (otherUsernames) => {
      console.log("Fetching - unread message from conversation")
      
      const tokenVal = await SecureStore.getItemAsync('token');
    
      const unreadMessagesListTemp = [];
      // Remove duplicates and get unique usernames.
      //const uniqueUsernames = Array.from(new Set(otherUsernames.map(usernameData => usernameData.username)));
      //console.log("UNIQUE USERNAMES", uniqueUsernames)

      console.log(otherUsernames)
    
      for (const username of otherUsernames) {
        console.log("UNIQUE USERNAME", username)
        let matchingEntry = unreadMessagesList.find(entry => entry.username === username);
        if (!matchingEntry) {
          matchingEntry = { unreadMessagescount: 0 }; // Default value when no matching entry is found
        }
        const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/messages/unreadMessagesFromConversation', {
          token: tokenVal,
          otherUser: username,
          unreadMessagesCount: matchingEntry.unreadMessagescount
        }).catch(error => {
          console.log("Couldn't fetch message - fetch unread messages")
          //return null
        })
        if (!response) {
          console.log("No response for messages - fetchunread messages")
          //return null
        }
        unreadMessagesListTemp.push({
        username: username,
        unreadMessagesCount: response.data.unreadMessagesCount
        });
        console.log("UNREAD TEMP     ", unreadMessagesListTemp)
        //return response.data
      }
      setUnreadMessagesList(unreadMessagesListTemp)
    };

    console.log()
    console.log("UNREAD MESSAGES LIST", unreadMessagesList)
    console.log()

    // console.log("UNREAD MESSAGES COUNT", unreadMessagesList)

    // // Initialize unreadMessagesList after setting the state
    // useEffect(() => {
    //   fetchUnreadMessages(otherUsersAndUpdates, unreadMessagesList);
    // }, [otherUsersAndUpdates]);
    
    // fetchUnreadMessages(otherUsersAndUpdates)
    //console.log("OTHER USERS", otherUsersAndUpdates)
    //console.log("UNREAD MESSAGES COUNT", unreadMessagesList)
    //fetchUnreadMessages(otherUsersAndUpdates)
    //console.log("NEW FUNCTION: ", unreadMessagesList)

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

  const formatTimestampDate = (timestamp) => {
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

    return `${formattedDate}`;
};
    
    const ChatItem = ({ item }) => (
      <TouchableOpacity style={[feedStyles.iconContainer, {backgroundColor:theme.backgroundColor}]} onPress={() => handleChatPress(item.otherUser)}>
        <View style={[styles.chatItem, {backgroundColor:theme.backgroundColor}]}>

          
          
          <View style={{flexDirection: 'row', alignItems: 'center', }}>
            <Avatar
                size={100}
                rounded
                source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + item.otherUser.username + '.jpg'}}
                containerStyle={{backgroundColor: 'grey', margin: 10}}
                activeOpacity={0.8}
                
              />
            { <Text style={[feedStyles.name, {color:theme.color}]}>{item.otherUser.information.firstName} {item.otherUser.information.lastName}</Text> }
            { <Text style={feedStyles.time}>{formatTimestamp(item.lastUpdated)} </Text> }
            {unreadMessagesList.map((user) => {
            if (user.username === item.otherUser.username && user.unreadMessagesCount !== 0) {
              return (
                <View key={user.username} style={{ marginLeft: 5 }}>
                  <Text style={{ color: 'blue' }}>● {user.unreadMessagesCount}</Text>
                </View>
              );
            }
            return null;
            })}
            
          </View>    
        </View>
      </TouchableOpacity>
    );

    // MODAL FOR DISPLAYING USERS FANCY... DOESN'T WORK THO
    // //console.log(displayedUsers)
    // const SearchMessagesDropdown = ({ data }) => {
    //   return (
    //     <Modal
    //       animationType="slide"
    //       transparent={true}
    //       visible={isDropdownVisible}
    //     >
    //       <View style={styles.dropdownContainer}>
    //         {/* <Text> HELLO </Text> */}
    //         <FlatList
    //           data={data}
    //           renderItem={({ item }) => (
    //             <TouchableOpacity
    //               style={styles.dropdownItem}
    //               onPress={() => {
    //                 // Handle the item selection (e.g., navigate to the selected message)
    //                 // You can pass the selected message to the parent component if needed.
    //                 // onClose();
    //               }}
    //             >
    //               <Text>{item.message}</Text>
    //             </TouchableOpacity>
    //           )}
    //           //keyExtractor={(item) => item.id.toString()} // Replace with your unique key
    //         />
    //       </View>
    //     </Modal>
    //   );
    // };
    
  
  
    return (
      <View style={[styles.container, {backgroundColor:theme.backgroundColor}]}>

        <View style={[styles.topBar, {backgroundColor:theme.backgroundColor}]}>

          <ConversationModal />
          <View style ={[styles.inputContainer, {backgroundColor:theme.backgroundColor}]}>
            <TextInput
              style={[styles.input,{color:theme.color}]}
              placeholder="Search for a message"
              placeholderTextColor='gray'
              onChangeText={(text) => {
                setSearchTerm(text);
                fetchSearchMessages(text);
                setIsDropdownVisible(!!text);
              }}
              autoCapitalize="none"
            />

            {isDropdownVisible && (
              
              <View style={styles.dropdownContainer}>
                <FlatList
                data={sortedDataFromSearch}
                keyExtractor={(item) => item._id}
                renderItem={({item,index }) => (
                  <TouchableOpacity
                    //value={searchTerm}
                    onPress={() => handleChatPressSearch(username !== item.users[0] ? item.users[0] : item.users[1])}
                    //activeOpacity={0.7} // You can adjust this value
                    underlayColor="gray">
                      <View style={styles.dropdownItemContainer}>
                      <Text style={styles.dropdownItem}>{"Conversation with: "}{username !== item.users[0] ? item.users[0] : item.users[1]}{'\n'}{item.sender}{": "}{item.message}{".........."}{formatTimestampDate(item.timestamp)}</Text>
                      </View>
                  </TouchableOpacity>
                  
                )}
                />
              </View>
            )}

          </View>          
        </View>

        <View style={styles.flatListContainer}>
          {displayedUsers.length > 0 ? (
            <FlatList
              data={displayedUsers} // Replace with your data array
              
              renderItem={({ item }) => ChatItem({item}) }
              keyExtractor={(item) => item._id} // Replace with a unique key extractor
              horizontal={false}
              contentContainerStyle={styles.flatListContent}
            />
          ) : (
          <ScrollView>
            <Text style={[styles.noMatchesText, {color:theme.color}]}>
              You have no matches. L
            </Text>
          </ScrollView>
          )}
        </View>
      </View>
      
    );
  }
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'left',
      justifyContent: 'left',
    },
    searchContainer: {
      backgroundColor: 'white',
      borderColor: 'lightgray',
      borderWidth: 1,
      borderRadius: 5,
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowRadius: 2,
    },
    dropdownItem: {
      padding: 10,
    },
    chatItem: {
     // Take up the entire available space
      backgroundColor: 'white',
      alignContent: 'center',
      alignItems: 'left',
      padding: 15,
      marginBottom: 10,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    dropdownList: {
      maxHeight: 200, // Set the maximum height for the dropdown
    },
    dropdownItemContainer: {
      borderColor: 'gray', // Border color
      borderWidth: .5,      // Border width
      borderRadius: .5,     // Border radius
       // Padding around the text
      marginRight: 30,   // Margin between items
      color: 'black',
    },
    dropdownContainer: {
      backgroundColor: 'white',
      width: '100%',
      borderColor: 'white',
      borderWidth: 1,
      borderRadius: 5,
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowRadius: 2,
      top: 46,
      position: 'absolute',
      zIndex: 90,
      height: '1700%',
      },
    inputContainer: {
      flex : 1,
      position: 'relative',
      minHeight: 0,
    },
    input: {
      width: '100%',
      height: 40,
      fontSize: 15,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      paddingLeft: 10,
    },
    hyperlink: {
      textDecorationLine: 'underline',
      color: 'blue',
    },
    searchButton: {
      backgroundColor: 'gold', // Change the background color as desired
      padding: 10,
      borderRadius: 5,
    },
    filterButton: {
      margin: 5,
      backgroundColor: 'gold', // Change the background color as desired
      padding: 10,
      borderRadius: 5,
    },
    searchButtonText: {
      color: 'gray', // Change the text color as desired
      fontSize: 13,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      padding: 10,
      zIndex: 1,
    },
    flatListContainer: {
      flex: 1, // Take up the remaining available space
      width: '100%', // Take up the entire width
      paddingHorizontal: 10, // Add padding to the sides
      zIndex: 0,
    },
    flatListContent: {
      flexGrow: 1, // Ensure the content can grow within the container
    },
    noMatchesText: {
      fontSize: 15,
      textAlign: "center",
      alignSelf: "center",
      justifyContent: "center",
      marginTop: "50%",
      marginHorizontal: "5%"
    },    
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 10
    },
    subtitle: {
      fontSize: 15,
      textAlign: 'left',
      marginVertical: 1,
    },
    unreadDot: {
      width: 10,
      height: 10,
      backgroundColor: 'blue',
      borderRadius: 5,
      marginRight: 5, // Adjust the margin as needed
    },
    });
    
  
  const feedStyles = StyleSheet.create({
    iconContainer: {
      paddingHorizontal: 10,
      textAlign: "right",
      alignContent: "right"
    },
    infoContainer: {
      width: '100%',
      padding: 10,
      fontSize: 16,
      lineHeight: 40
    },
    name: {
      padding: 1,
      fontSize: 20
    },
    time: {
      paddingLeft: 10,
      fontSize: 10,
      alignItems: "flex-end",
    },
    username: {
      fontSize: 16,
      color: 'grey',
      paddingBottom: 6
    },
    infoLabel: {
      fontWeight: '600',
    },
    dropdownContainer: {
      flex: 1,
      backgroundColor: 'grey',
      position: 'absolute',
      top: 60, // Adjust the position as needed
      right: 10, // Adjust the position as needed
      width: 200, // Adjust the width as needed
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
    },
    dropdownItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: 'lightgray',
    },  
    
  });

import { StatusBar } from 'expo-status-bar';
import Conversation from './Conversation';
import {StyleSheet, Text, View,TouchableOpacity,TextInput, Modal, Button, Image, Pressable, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import { Avatar } from '@rneui/themed';
import { RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

export default function ChatList({navigation,checkForMatch}) {
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showOnlyUsersLikedBy, setShowOnlyUsersLikedBy] = useState(false)

    const [searchTerm, setSearchTerm] = useState('');
    //variables for dropdown
    const [searchResults, setSearchResults] = useState([])

    const [chatOpened, setChatOpened] = useState(false) 

    const [selectedUser, setSelectedUser] = useState('')
    
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
            setSearchResults(response.data.messages);
            // Set your dropdown visibility state here if needed.
          } else {
            // Show a pop-up message saying that no messages match.
            console.log("No messages match")
          }
        } else {
          // Handle non-200 status codes if needed.
          console.log(`Received a non-200 status code: ${response.status}`);
        }
      } catch (error) {
        console.log("Error occurred while searching for messages:", error);
        // Handle the error as needed.
      }
    };

    const dataFromSearch = searchResults.map(result => ({
      userOne: result.userOne,
      userTwo: result.userTwo,
      message: result.messages,
    }));
    
    console.log(dataFromSearch);
    

    // console.log("SEARCHHHH")
    // console.log(searchResults)
    // console.log("NEWDATA")
    // console.log(dataFromSearch)

    useEffect(() => {
      handleRefreshFeed()
    },[checkForMatch]);

    useFocusEffect(
      React.useCallback(() => {
        handleRefreshFeed();
      }, [])
    );
    
    
    // useEffect(() => {
    //   setDisplayedUsers([...displayedUsers].sort((a, b) => a.lastUpdated - b.lastUpdated));
    // }, [displayedUsers])

   
  
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
    }

    const ConversationModal = () => {
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={chatOpened}>
            <Conversation otherUser={selectedUser} onClose={() => setChatOpened(false)}/>
        </Modal>
      )
    }
  
    const handleChatPress = async(user) => {
      //open chat
      setSelectedUser(user.username)
      setChatOpened(true)
      console.log("CHAT PRESSED")
    };
    
  
    const onRefresh = async() => {
      setRefreshing(true);
      //setUsersLiked({})
      handleRefreshFeed();
      // ... Fetch data ...
      setRefreshing(false);
    };
  
    {/* RENDER FOR BLUE DOT AND UNREAD MESSAGES */}

    // const ChatItem = ({ item, hasUnreadMessages }) => (
    //   <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleChatPress(item.otherUser)}>
    //     <View style={styles.chatItem}>
          
          
    //       <View style={{flexDirection: 'row', alignItems: 'center', }}>
    //         <Avatar
    //             size={100}
    //             rounded
    //             source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + item.otherUser.username + '.jpg'}}
    //             containerStyle={{backgroundColor: 'grey', margin: 10}}
    //             activeOpacity={0.8}
                
    //           />
    //         { <Text style={feedStyles.name}>{item.otherUser.information.firstName} {item.otherUser.information.lastName}</Text> }
    //         {hasUnreadMessages && <View style={styles.unreadDot} />} 
    //       </View>    
    //     </View>
    //   </TouchableOpacity>
    // );
    const ChatItem = ({ item }) => (
      <TouchableOpacity style={feedStyles.iconContainer} onPress={() => handleChatPress(item.otherUser)}>
        <View style={styles.chatItem}>
          
          
          <View style={{flexDirection: 'row', alignItems: 'center', }}>
            <Avatar
                size={100}
                rounded
                source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + item.otherUser.username + '.jpg'}}
                containerStyle={{backgroundColor: 'grey', margin: 10}}
                activeOpacity={0.8}
                
              />
            { <Text style={feedStyles.name}>{item.otherUser.information.firstName} {item.otherUser.information.lastName}</Text> }
          </View>    
        </View>
      </TouchableOpacity>
    );

    console.log(displayedUsers)
  
  
    return (
      <View style={styles.container}>

        <View style={styles.topBar}>

          <ConversationModal />
          <View style ={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Search for a message"
              onChangeText={(text) => {
                setSearchTerm(text);
                fetchSearchMessages(text);
              }}
              autoCapitalize="none"
            />
          </View>          
        </View>

        <View style={styles.flatListContainer}>
          {displayedUsers.length > 0 ? (
            <FlatList
              data={displayedUsers} // Replace with your data array
              
              renderItem={({ item }) => ChatItem({item}) }
              keyExtractor={(item) => item.username} // Replace with a unique key extractor
              horizontal={false}
              contentContainerStyle={styles.flatListContent}
            />
          ) : (
          <ScrollView>
            <Text style={styles.noMatchesText}>
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
      padding: 10,
      fontSize: 20
    },
    username: {
      fontSize: 16,
      color: 'grey',
      paddingBottom: 6
    },
    infoLabel: {
      fontWeight: '600',
    },  
    
  })
import { StatusBar } from 'expo-status-bar';
import Conversation from './Conversation';
import {StyleSheet, Text, View,TouchableOpacity,TextInput, Modal, Button, Image, Pressable, ScrollView, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"
import { Avatar } from '@rneui/themed';
import { RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function ChatList({navigation,refreshOnMatch}) {
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showOnlyUsersLikedBy, setShowOnlyUsersLikedBy] = useState(false)
  
    
  
    
    useEffect(() => {
      handleRefreshFeed()
    },[refreshOnMatch]);
    
    
    /* edit this function to open chat */
    const handleUserItemClick = (user) => {
    //   setSelectedUser(user);
    //   setIsUserModalVisible(true);
    };
  
    const handleRefreshFeed = async() => {
      const tokenVal = await SecureStore.getItemAsync('token')
  
      const response = await axios.post(process.env.EXPO_PUBLIC_API_HOSTNAME + '/api/user/getMatchesForUser', {
        token: tokenVal
      }
      ).catch(error => {
        console.log("Error occurred while pulling users", error)
      })
      console.log(response.data)
      setDisplayedUsers(response.data.users)
    }
  
    const handleChatPress = async(user) => {
      //open chat    
      console.log("chat pressed!")
    };
    
  
    const onRefresh = async() => {
      setRefreshing(true);
      //setUsersLiked({})
      handleRefreshFeed();
      // ... Fetch data ...
      setRefreshing(false);
    };
  
    const ChatItem = ({ user, onChatPress }) => (
      <View style={styles.chatItem}>
        <Avatar
            size={250}
            rounded
            source={{uri: 'https://boilermatch.blob.core.windows.net/pfp/' + user.username + '.jpg'}}
            containerStyle={{backgroundColor: 'grey', margin: 10, alignSelf: 'left'}}
            activeOpacity={0.8}
          />
        
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={feedStyles.iconContainer} onPress={() => onChatPress(user)}>
            <Ionicons
              name={'chatbubble-outline'} 
              color={'gray'}
              size={40}
            />
          </TouchableOpacity>
          
        </View>    
      </View>
    );
  
  
    return (
      <View style={styles.flatListContainer}>
        {displayedUsers.length > 0 ? (
          <FlatList
            data={displayedUsers} // Replace with your data array
              renderItem={({ item }) => <ChatItem user={item} onChatPress={handleChatPress}/>}
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
    );
  }
  
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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
      alignItems: 'center',
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
    }
    ,
    input: { // Adjust the width as needed to make it smaller
      height: 40, // Adjust the height as needed
      flex: 1,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      padding: 10,
      marginRight: 30,
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
      padding: 20,
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
    });
    
  
  const feedStyles = StyleSheet.create({
    iconContainer: {
      paddingHorizontal: 10
    },
    infoContainer: {
      width: '100%',
      padding: 10,
      fontSize: 16,
      lineHeight: 40
    },
    name: {
      fontSize: 25
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